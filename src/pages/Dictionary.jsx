import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useReducer, useRef } from "react";
import {
  faSearch,
  faTrash,
  faStar,
  faLink,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
  words: [],
  selectedTags: [],
  selectedTypes: [],
  dup: false,
  search: "",
  open: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_WORD":
      return { ...state, words: action.payload }; //...state keeps everything else unrelated to action.payload's target

    case "SELECT_TYPES":
      return {
        ...state,
        selectedTypes: state.selectedTypes.includes(action.payload)
          ? state.selectedTypes.filter((tag) => tag !== action.payload)
          : [...state.selectedTypes, action.payload],
      };

    case "SELECT_TAGS":
      return {
        ...state,
        selectedTags: state.selectedTags.includes(action.payload)
          ? state.selectedTags.filter((tag) => tag !== action.payload)
          : [...state.selectedTags, action.payload],
      };

    case "SUBMIT_WORD":
      return { ...state, words: [...state.words, action.payload] };

    case "FAVORITE":
      return {
        ...state,
        words: state.words.map((w) =>
          w.id === action.payload ? { ...w, favorite: !w.favorite } : w,
        ),
      };

    case "DELETE":
      return {
        ...state,
        words: state.words.filter((w) => w.id !== action.payload),
      };

    case "RESET_FORM":
      return { ...state, selectedTags: [], selectedTypes: [], dup: false };

    case "DUPLICATED":
      return { ...state, dup: action.payload };

    case "SEARCH":
      return { ...state, search: action.payload };

    case "OPEN_FORM":
      return { ...state, open: !state.open };

    case "ROLLBACK":
      const rw = [...state.words];
      rw.splice(action.index, 0, action.payload);

      return { ...state, words: rw };

    default:
      return state;
  }
};

const Dictionary = () => {
  const Name = useRef();
  const Link = useRef();

  const DateCreated = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const tagColors = {
    A1: "bg-green-200",
    A2: "bg-green-500",
    B1: "bg-pink-200",
    B2: "bg-pink-500",
    C1: "bg-indigo-400",
    C2: "bg-purple-600",
  };

  const wordType = [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "interjection",
    "phrase",
    "idiom",
    "phrasal verb",
  ];

  //Fetch words
  useEffect(() => {
    let isLoaded = true;

    async function fetchWords() {
      try {
        const querySnapshot = await getDocs(collection(db, "words"));

        if (!isLoaded) return;

        const wordList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch({ type: "FETCH_WORD", payload: wordList });
      } catch (error) {
        console.log("Failed to fetch your words!");
      }
    }

    fetchWords();

    return () => {
      isLoaded = false;
    };
  }, []);

  //POST
  const Create = async (e) => {
    e.preventDefault();

    const newWord = {
      tag: state.selectedTags,
      name: Name.current.value.trim(),
      type: state.selectedTypes,
      date: DateCreated,
      link: Link.current.value.trim(),
      favorite: false,
    };

    if (Name.current.value && Link.current.value) {
      const wordsRef = collection(db, "words");
      const q = query(
        wordsRef,
        where("name", "==", newWord.name.trim().toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        dispatch({ type: "DUPLICATED", payload: true });
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "words"), newWord);
        dispatch({
          type: "SUBMIT_WORD",
          payload: { id: docRef.id, ...newWord },
        });

        // Reset form
        dispatch({ type: "RESET_FORM" });
        Name.current.value = "";
        Link.current.value = "";

        document.querySelectorAll("input[type=checkbox]").forEach((el) => {
          el.checked = false;
        });
      } catch (err) {
        console.log("An error has occurred while creating your word :< ", err);
      }
    }
  };

  //Favorite
  const Favor = async (word) => {
    //update UI immediately
    dispatch({ type: "FAVORITE", payload: word.id });

    try {
      const wordRef = doc(db, "words", word.id);
      await updateDoc(wordRef, {
        favorite: !word.favorite,
      });
    } catch (err) {
      console.error("Couldn't favorite word");
      setTimeout(() => {
        dispatch({ type: "FAVORITE", payload: word.id }); //rollback
      }, 500);
    }
  };

  //Delete
  const Delete = async (word, index) => {
    dispatch({ type: "DELETE", payload: word.id });
    try {
      await deleteDoc(doc(db, "words", word.id));
    } catch (err) {
      console.error("Couldn't delete word");
      setTimeout(() => {
        dispatch({ type: "ROLLBACK", payload: word, index });
      }, 500);
    }
  };

  //Search
  const filteredWords = useMemo(() => {
    return state.words.filter((item) => {
      return item.name?.toLowerCase().includes(state.search.toLowerCase());
    });
  }, [state.words, state.search]);

  return (
    <>
      <div
        className={`${state.open ? "z-50 -translate-y-1/2 opacity-100" : "-z-10 -translate-y-3/4 opacity-0"} bg-secondary dark:bg-secondary-dark fixed top-1/2 left-1/2 flex w-3/4 max-w-[650px] min-w-[200px] -translate-x-1/2 flex-col justify-center gap-8 rounded-md p-5 transition-all duration-500`}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-main bg-accent dark:bg-accent-dark dark:text-main-dark hover:text-accent-hovered dark:hover:text-accent-hovered-dark ml-auto cursor-pointer rounded-md px-1 py-1.75 text-2xl transition-all duration-300"
          onClick={() => dispatch({ type: "OPEN_FORM" })}
        />

        <div className="relative flex flex-wrap gap-3">
          {Object.entries(tagColors).map(([tag, color]) => (
            <div
              key={tag}
              className={`text-heading relative w-12 text-center font-semibold select-none`}
            >
              <input
                type="checkbox"
                onChange={(e) =>
                  dispatch({ type: "SELECT_TAGS", payload: e.target.value })
                }
                value={tag}
                className="peer absolute top-1/2 left-0 z-50 size-full -translate-y-1/2 cursor-pointer appearance-none"
              />
              <span
                className={`transition duration-300 peer-checked:opacity-30 ${color} inline-block size-full rounded-sm px-2 py-0.5`}
              >
                {tag}
              </span>
              <FontAwesomeIcon
                icon={faCheck}
                className="text-accent dark:text-accent-dark absolute left-1/2 z-10 -translate-x-1/2 text-2xl opacity-0 transition duration-300 peer-checked:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            required
            ref={Name}
            onChange={() => {
              dispatch({ type: "DUPLICATED", payload: false });
            }}
            placeholder="Funny"
            type="text"
            className={`placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark w-full rounded-md border-2 px-4 pt-4 pb-3 text-xl outline-none ${state.dup ? "border-red-500" : "border-accent dark:border-accent-dark"}`}
          />

          <span
            className={`${state.dup ? "block" : "hidden"} px-3 py-1 text-lg text-red-500`}
          >
            ⚠︎ This word already exists!
          </span>

          <span className="bg-secondary dark:bg-secondary-dark text-heading dark:text-heading-dark absolute -top-3 left-5 px-2.5 transition duration-500 select-none">
            Word
          </span>
        </div>

        <div className="relative flex flex-wrap gap-2">
          {wordType.map((type, index) => (
            <div
              key={index}
              className={`relative flex items-center font-semibold text-nowrap select-none`}
            >
              <input
                type="checkbox"
                onChange={(e) =>
                  dispatch({ type: "SELECT_TYPES", payload: e.target.value })
                }
                value={type}
                className="peer absolute top-1/2 left-0 size-full -translate-y-1/2 cursor-pointer appearance-none"
              />
              <span className="peer-checked:bg-accent peer-checked:text-main dark:peer-checked:text-main-dark dark:peer-checked:bg-accent-dark bg-subtext dark:bg-subtext-dark rounded-sm px-2 py-0.5 transition duration-300">
                {type}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            required
            ref={Link}
            placeholder="dictionary/english/..."
            type="text"
            className="placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark border-accent dark:border-accent-dark w-full rounded-md border-2 px-4 pt-4 pb-3 text-xl outline-none"
          />

          <span className="bg-secondary dark:bg-secondary-dark text-heading dark:text-heading-dark absolute -top-3 left-5 px-2.5 transition duration-500 select-none">
            Link
          </span>
        </div>

        <button
          className="text-main hover:bg-accent-hovered dark:hover:bg-accent-hovered-dark dark:text-main-dark bg-accent dark:bg-accent-dark cursor-pointer rounded-md p-1 text-xl font-semibold transition duration-500"
          type="button"
          onClick={Create}
        >
          Create
        </button>
      </div>

      <section
        className={`${state.open && "opacity-30"} dark:bg-main-dark bg-main grid h-screen w-screen overflow-hidden transition-all duration-300 lg:pl-25`}
      >
        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-accent dark:text-accent-dark text-2xl font-semibold text-nowrap md:text-3xl lg:text-4xl">
              English Dictionary
            </div>
            <span className="text-heading dark:text-heading-dark">
              Total number of words: {state.words.length}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="bg-secondary dark:bg-secondary-dark border-accent dark:border-accent-dark flex w-full max-w-[450px] min-w-[200px] items-center space-x-3 rounded-md border-2 px-4 py-2.5 text-2xl">
              <input
                placeholder="Search..."
                value={state.search}
                onChange={(e) =>
                  dispatch({ type: "SEARCH", payload: e.target.value })
                }
                type="text"
                className="placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark w-full outline-none"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="text-accent dark:text-accent-dark"
              />
            </div>

            <button
              onClick={() => dispatch({ type: "OPEN_FORM" })} //Wrap dispatch in a function to hinder infinite re-render loop
              className="text-main dark:text-main-dark bg-accent dark:bg-accent-dark cursor-pointer rounded-md px-5 text-2xl"
            >
              Add
            </button>
          </div>

          <div className="z-30 grid h-2/3 max-h-[660px] auto-rows-min grid-cols-1 gap-5 overflow-x-hidden overflow-y-auto px-3 pb-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredWords.length === 0
              ? (
                <div className="flex relative justify-between select-none w-70 text-4xl">
                      <span className="rotate-y-180">🐇</span>
                      <span className="absolute animate-carrot">🥕</span>
                      <span>🐇</span>
                </div>
              ) : filteredWords
                  .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
                  .map((word, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-secondary group dark:bg-secondary-dark border-accent dark:border-accent-dark relative flex h-60 w-71 flex-col justify-between border-b-4 p-4"
                      >
                        <div className="flex gap-2">
                          {(Array.isArray(word.tag) && word.tag.length > 0
                            ? word.tag
                            : ["N/A"]
                          )
                            .filter(Boolean) //removes null/undefined/empty strings
                            .sort((a, b) => a.localeCompare(b))
                            .map((t, i) => {
                              return (
                                <span
                                  className={`${tagColors[t] || "bg-gray-300"} text-heading rounded-sm px-2 font-semibold`}
                                  key={i}
                                >
                                  {t || "N/A"}
                                </span>
                              );
                            })}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <p
                            className={`text-heading dark:text-heading-dark line-clamp-2 font-[Poppins] text-2xl font-semibold text-balance ${word.name.length <= 10 ? "text-4xl" : word.name.length <= 25 ? "text-3xl" : word.name.length <= 40 ? "text-2xl" : "text-xl"}`}
                          >
                            {word.name.charAt(0).toUpperCase() +
                              word.name.slice(1).toLowerCase()}
                          </p>

                          <div className="flex flex-wrap">
                            {(Array.isArray(word.type)
                              ? word.type
                              : [word.type]
                            ).map((t, i, arr) => {
                              return (
                                <span
                                  className={`text-subtext dark:text-subtext-dark px-1 text-sm font-semibold`}
                                  key={i}
                                >
                                  {t}
                                  {i < arr.length - 1 && ","}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-subtext dark:text-subtext-dark">
                            {word.date}
                          </span>
                          <a
                            target="_blank"
                            href={`https://dictionary.cambridge.org/dictionary/english/${word.link}`}
                            className="ml-auto flex items-center"
                          >
                            <FontAwesomeIcon
                              icon={faLink}
                              className="text-heading dark:text-heading-dark cursor-pointer text-xl transition-all hover:text-blue-500"
                            />
                          </a>

                          <button
                            type="button"
                            onClick={() => Delete(word, index)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-heading dark:text-heading-dark cursor-pointer text-xl transition-all hover:text-red-500"
                            />
                          </button>

                          <button type="button" onClick={() => Favor(word)}>
                            <FontAwesomeIcon
                              icon={faStar}
                              className={`cursor-pointer text-xl transition-all ${word.favorite ? "text-yellow-300" : "text-heading dark:text-heading-dark hover:text-yellow-300"}`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dictionary;
