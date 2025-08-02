import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
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

const Dictionary = () => {
  const Name = useRef();
  const Link = useRef();

  const DateCreated = new Date();
  const formattedDate = DateCreated.toLocaleDateString("en-US").slice(0, 8);

  const [words, setWords] = useState([]);
  const [dup, setDupState] = useState(false);
  const [SelectedTags, setSelectedTags] = useState([]);
  const [SelectedTypes, setSelectedTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const tagColors = {
    A1: "bg-lime-200",
    A2: "bg-green-500",
    B1: "bg-purple-300",
    B2: "bg-yellow-500",
    C1: "bg-blue-400",
    C2: "bg-red-400",
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

  const Dialog = () => {
    setOpen(!open);
  };

  //Fetch words on load
  useEffect(() => {
    const fetchWords = async () => {
      const querySnapshot = await getDocs(collection(db, "words"));
      const wordList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWords(wordList);
    };

    fetchWords();
  }, []);

  //Handle tag checkboxes
  const checkHandlerTag = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, value]);
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== value));
    }
  };

  //Handle type checkboxes
  const checkHandlerType = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setSelectedTypes((prev) => [...prev, value]);
    } else {
      setSelectedTypes((prev) => prev.filter((type) => type !== value));
    }
  };

  //POST new words to db.json
  const Create = async (e) => {
    e.preventDefault();

    const newWord = {
      tag: SelectedTags,
      name: Name.current.value.trim(),
      type: SelectedTypes,
      date: formattedDate,
      link: Link.current.value.trim(),
      favorite: false,
    };

    if (SelectedTags.length && Name.current.value && Link.current.value) {
      const wordsRef = collection(db, "words");
      const q = query(
        wordsRef,
        where("name", "==", newWord.name.trim().toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setDupState(!dup);
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "words"), newWord);
        setWords((prev) => [...prev, { id: docRef.id, ...newWord }]);
      } catch (err) {
        console.log("Nah");
      }

      setSelectedTags([]);
      setSelectedTypes([]);
      Name.current.value = "";
      Link.current.value = "";

      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        el.checked = false;
      });
    }
  };

  //Favourite new words to db.json
  const Favor = async (word) => {
    try {
      const wordRef = doc(db, "words", word.id);
      await updateDoc(wordRef, {
        favorite: !word.favorite,
      });

      setWords((prevWords) =>
        prevWords.map((w) =>
          w.id === word.id ? { ...w, favorite: !w.favorite } : w,
        ),
      );
    } catch (err) {
      console.error("Couldn't favorite word");
    }
  };

  //Delete from db.json
  const Delete = async (id) => {
    try {
      await deleteDoc(doc(db, "words", id));
      setWords((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Couldn't delete word");
    }
  };

  //Search bar
  const filteredWords = words.filter((item) => {
    return item.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <form
        onSubmit={Create}
        className={`${open ? "z-50 -translate-y-1/2 opacity-100" : "-z-10 -translate-y-3/4 opacity-0"} bg-secondary dark:bg-secondary-dark fixed top-1/2 left-1/2 flex w-3/4 max-w-[650px] min-w-[200px] -translate-x-1/2 flex-col justify-center gap-8 rounded-md p-5 transition-all duration-500`}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-main bg-accent dark:bg-accent-dark dark:text-main-dark hover:text-accent-hovered dark:hover:text-accent-hovered-dark ml-auto cursor-pointer rounded-md px-1 py-1.75 text-2xl transition-all duration-300"
          onClick={Dialog}
        />

        <div className="relative flex flex-wrap gap-2">
          <span className="text-heading dark:text-heading-dark mt-auto text-xl transition-all duration-300">
            Tags:
          </span>
          {Object.entries(tagColors).map(([tag, color]) => (
            <div
              key={tag}
              className={`text-heading relative mt-8 w-12 rounded-sm px-2 py-0.5 text-center font-semibold select-none ${color}`}
            >
              <input
                type="checkbox"
                onChange={checkHandlerTag}
                value={tag}
                className="peer absolute top-1/2 left-0 size-full -translate-y-1/2 cursor-pointer appearance-none"
              />
              <span>{tag}</span>
              <FontAwesomeIcon
                icon={faCheck}
                className="text-accent dark:text-accent-dark absolute -top-0 left-1/2 -z-10 -translate-x-1/2 text-xl opacity-0 transition-all duration-200 peer-checked:-top-7 peer-checked:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            required
            ref={Name}
            onChange={() => {
              setDupState(false);
            }}
            placeholder="Funny"
            type="text"
            className={`placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark w-full rounded-md border-2 px-4 pt-4 pb-3 text-xl outline-none ${dup ? "border-red-500" : "border-accent dark:border-accent-dark"}`}
          />

          <span
            className={`${dup ? "block" : "hidden"} px-3 py-1 text-lg text-red-500`}
          >
            ⚠︎ This word already exists!
          </span>

          <span className="bg-secondary dark:bg-secondary-dark text-heading dark:text-heading-dark absolute -top-3 left-5 px-2.5 transition-all duration-500 select-none">
            Word
          </span>
        </div>

        <div className="relative flex flex-wrap gap-2">
          <span className="text-heading dark:text-heading-dark mt-auto text-xl transition-all duration-300">
            Type(s):
          </span>

          {wordType.map((type, index) => (
            <div
              key={index}
              className={`relative flex items-center font-semibold text-nowrap select-none`}
            >
              <input
                type="checkbox"
                onChange={checkHandlerType}
                value={type}
                className="peer absolute top-1/2 left-0 size-full -translate-y-1/2 cursor-pointer appearance-none"
              />
              <span className="peer-checked:bg-accent peer-checked:text-main dark:peer-checked:text-main-dark dark:peer-checked:bg-accent-dark bg-subtext dark:bg-subtext-dark rounded-sm px-2 py-0.5 transition-all duration-300">
                {type}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            required
            ref={Link}
            placeholder="dictionary/english/funny"
            type="text"
            className="placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark border-accent dark:border-accent-dark w-full rounded-md border-2 px-4 pt-4 pb-3 text-xl outline-none"
          />

          <span className="bg-secondary dark:bg-secondary-dark text-heading dark:text-heading-dark absolute -top-3 left-5 px-2.5 transition-all duration-500 select-none">
            Link
          </span>
        </div>

        <button
          className="text-main hover:bg-accent-hovered dark:hover:bg-accent-hovered-dark dark:text-main-dark bg-accent dark:bg-accent-dark cursor-pointer rounded-md p-1 text-xl font-semibold transition-all duration-500"
          type="submit"
        >
          Create Word!
        </button>
      </form>

      <section
        className={`${open && "opacity-30"} dark:bg-main-dark bg-main grid h-screen w-screen overflow-hidden transition-all duration-300 lg:pl-20`}
      >
        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-4">
          <div className="text-heading dark:text-heading-dark text-2xl font-semibold text-nowrap md:text-3xl">
            English Dictionary
          </div>
          <div className="flex gap-2">
            <div className="bg-secondary dark:bg-secondary-dark border-accent dark:border-accent-dark flex w-full max-w-[450px] min-w-[200px] items-center space-x-3 rounded-md border-2 px-4 py-2.5 text-2xl">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark w-full outline-none"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="text-accent dark:text-accent-dark"
              />
            </div>

            <button
              onClick={Dialog}
              className="text-main dark:text-main-dark bg-accent dark:bg-accent-dark cursor-pointer rounded-md px-5 text-2xl"
            >
              Add
            </button>
          </div>

          <div className="z-30 grid h-2/3 max-h-[660px] auto-rows-min grid-cols-1 gap-5 overflow-x-hidden overflow-y-auto px-3 pb-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredWords
              .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
              .map((word, index) => {
                return (
                  <div
                    key={index}
                    className="bg-secondary dark:bg-secondary-dark border-accent dark:border-accent-dark flex h-60 w-71 flex-col justify-between border-b-4 p-4"
                  >
                    <div className="flex gap-2">
                      {(Array.isArray(word.tag) ? word.tag : [word.tag])
                        .sort((a, b) => a.localeCompare(b))
                        .map((t, i) => {
                          return (
                            <span
                              className={`${tagColors[t]} text-heading rounded-sm px-2 font-semibold`}
                              key={i}
                            >
                              {t}
                            </span>
                          );
                        })}
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <p className="text-heading dark:text-heading-dark line-clamp-2 font-[Poppins] text-2xl font-semibold">
                        {word.name}
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
                        href={`https://dictionary.cambridge.org/${word.link}`}
                        className="ml-auto flex items-center"
                      >
                        <FontAwesomeIcon
                          icon={faLink}
                          className="text-heading dark:text-heading-dark cursor-pointer text-xl transition-all hover:text-blue-500"
                        />
                      </a>

                      <button type="button" onClick={() => Delete(word.id)}>
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
