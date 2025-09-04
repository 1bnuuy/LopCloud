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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useToast } from "../ui/Toast";
import { AnimatePresence, motion } from "motion/react";
import { btnVariants } from "../ui/Theme";

const initialState = {
  words: [],
  selectedTags: [],
  selectedTypes: [],
  dup: false,
  search: "",
  open: false,
  confirm: false,
  confirmTarget: null,
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

    case "DELETE":
      return {
        ...state,
        words: state.words.filter((w) => w.id !== action.payload),
      };

    case "FAVORITE":
      return {
        ...state,
        words: state.words.map((w) =>
          w.id === action.payload ? { ...w, favorite: !w.favorite } : w,
        ),
      };

    case "RESET_FORM":
      return { ...state, selectedTags: [], selectedTypes: [], dup: false };

    case "DUPLICATED":
      return { ...state, dup: action.payload };

    case "SEARCH":
      return { ...state, search: action.payload };

    case "OPEN_FORM":
      return { ...state, open: !state.open };

    case "CONFIRMATION":
      return {
        ...state,
        confirm: !state.confirm,
        confirmTarget: action.payload ?? null,
      };

    case "ROLLBACK":
      const rw = [...state.words];
      rw.splice(action.index, 0, action.payload);

      return { ...state, words: rw };

    default:
      return state;
  }
};

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

const Dictionary = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const Name = useRef();

  const toastPopUp = (mode, Msg, closeMsg) => {
    toast.open((id) => (
      <div className="bg-secondary dark:bg-secondary-dark flex w-[90vw] max-w-[555px] justify-between gap-3 rounded-lg px-3 py-2">
        <div className="flex items-center gap-3 self-stretch">
          <span
            className={`${mode ? "bg-success" : "bg-error"} w-1.5 self-stretch rounded-full`}
          />
          <div className="flex flex-col">
            <span
              className={`${mode ? "text-success" : "text-error"} text-lg font-bold`}
            >
              {mode ? "Hooray!" : "Uh-oh!"}
            </span>
            <span className="text-subtext dark:text-subtext-dark text-sm">
              {Msg}
            </span>
          </div>
        </div>

        <motion.button
          variants={btnVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="text-accent dark:text-accent-dark bg-tertiary dark:bg-tertiary-dark active:text-accent-hovered dark:active:text-accent-hovered-dark hover:text-accent-hovered dark:hover:text-accent-hovered-dark cursor-pointer self-center rounded-md px-2 py-1 font-bold text-nowrap"
          onClick={() => toast.close(id)}
        >
          {closeMsg}
        </motion.button>
      </div>
    ));
  };

  const DateCreated = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  //Fetch words
  useEffect(() => {
    let firstLoad = true;

    const DelayTransition = setTimeout(() => {
      const fetchWords = onSnapshot(
        collection(db, "words"),
        (snapshot) => {
          const wordList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch({ type: "FETCH_WORD", payload: wordList });

          if (firstLoad) {
            toastPopUp(
              true,
              `Poo returned with a basket containing ${wordList.length} carrots!`,
              "Thanks",
            );
            firstLoad = false;
          }
        },
        () => {
          toastPopUp(
            false,
            "Oops, Poo stepped on the cable… connection lost!",
            "Dismiss",
          );
        },
      );

      return () => fetchWords();
    }, 600);

    return () => clearTimeout(DelayTransition);
  }, []);

  //Add words
  const Create = async (e) => {
    e.preventDefault();

    const newWord = {
      tag: state.selectedTags,
      name: Name.current.value.trim().toLowerCase(),
      type: state.selectedTypes,
      date: DateCreated,
      favorite: false,
    };

    const blankFields = [];

    if (!Name.current.value) blankFields.push("Name");
    if (!state.selectedTypes.length) blankFields.push("Class");

    if (Name.current.value && state.selectedTypes.length) {
      const wordsRef = collection(db, "words");
      const q = query(
        wordsRef,
        where("name", "==", newWord.name.trim().toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        dispatch({ type: "DUPLICATED", payload: true });
        toastPopUp(
          false,
          "This word already exists! Pee and Poo won't let it in!",
          "Okay",
        );
        return;
      }

      try {
        await addDoc(collection(db, "words"), newWord);
        toastPopUp(true, "New word created, Pee hugs it tight!", "Hop");

        // Reset form
        dispatch({ type: "RESET_FORM" });
        Name.current.value = "";

        document.querySelectorAll("input[type=checkbox]").forEach((el) => {
          el.checked = false;
        });
      } catch (err) {
        toastPopUp(
          false,
          "The word ran away before Pee could catch it...",
          "Oops",
        );
      }
    } else {
      toastPopUp(
        false,
        `Hoppy mistake! ${blankFields.join(", ")} ${blankFields.length > 1 ? "fields are" : "field is"} still blank!`,
        "On it",
      );
    }
  };

  //Favorite
  const Favor = async (word) => {
    dispatch({ type: "FAVORITE", payload: word.id });

    try {
      const wordRef = doc(db, "words", word.id);
      await updateDoc(wordRef, {
        favorite: !word.favorite,
      });

      if (!word.favorite) {
        toastPopUp(true, "Favorited! Poo stuck a bow", "Done");
      }
    } catch (err) {
      toastPopUp(false, "Star sticker fell off...", "Burrow");
      setTimeout(() => {
        dispatch({ type: "FAVORITE", payload: word.id }); //rollback
      }, 300);
    }
  };

  //Delete
  const Delete = async (word, index) => {
    dispatch({ type: "DELETE", payload: word.id });

    try {
      await deleteDoc(doc(db, "words", word.id));
      toastPopUp(true, `Poo made ${word.name.toUpperCase()} vanish!`, "Bye");
    } catch (err) {
      toastPopUp(
        false,
        "The word refused to leave, Pee is chasing it around!",
        "Retry",
      );
      setTimeout(() => {
        dispatch({ type: "ROLLBACK", payload: word, index });
      }, 300);
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
      <div className="fixed top-1/2 left-1/2 z-40 w-11/12 max-w-[650px] min-w-[200px] -translate-x-1/2 -translate-y-1/2 transition">
        <AnimatePresence mode="wait">
          {state.open && (
            <motion.div
              key="form"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-secondary dark:bg-secondary-dark flex flex-col justify-center gap-8 rounded-md p-5"
            >
              <motion.button
                variants={btnVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="ml-auto cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-primary bg-accent dark:bg-accent-dark hover:bg-accent-hovered dark:hover:bg-accent-hovered-dark rounded-md px-1 py-1.75 text-2xl"
                  onClick={() => dispatch({ type: "OPEN_FORM" })}
                />
              </motion.button>

              <div className="relative flex flex-wrap gap-3">
                {Object.entries(tagColors).map(([tag, color]) => (
                  <motion.div
                    variants={btnVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    key={tag}
                    className={`text-heading relative w-12 text-center font-semibold select-none`}
                  >
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        dispatch({
                          type: "SELECT_TAGS",
                          payload: e.target.value,
                        })
                      }
                      value={tag}
                      className="peer absolute top-1/2 left-0 z-50 size-full -translate-y-1/2 cursor-pointer appearance-none"
                    />
                    <span
                      className={`peer-checked:opacity-30 ${color} inline-block size-full rounded-sm px-2 py-0.5`}
                    >
                      {tag}
                    </span>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-accent dark:text-accent-dark absolute left-1/2 z-10 -translate-x-1/2 text-2xl opacity-0 peer-checked:opacity-100"
                    />
                  </motion.div>
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

                <span
                  className={`bg-secondary dark:bg-secondary-dark absolute -top-3 left-5 px-2.5 select-none ${state.dup ? "text-red-500" : "text-heading dark:text-heading-dark"}`}
                >
                  Name
                </span>
              </div>

              <div className="relative flex flex-wrap gap-2">
                {wordType.map((type, index) => (
                  <motion.div
                    variants={btnVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    key={index}
                    className={`relative flex items-center font-semibold text-nowrap select-none`}
                  >
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        dispatch({
                          type: "SELECT_TYPES",
                          payload: e.target.value,
                        })
                      }
                      value={type}
                      className="peer absolute top-1/2 left-0 size-full -translate-y-1/2 cursor-pointer appearance-none"
                    />
                    <span className="peer-checked:bg-accent peer-checked:text-primary dark:peer-checked:bg-accent-dark bg-subtext dark:bg-subtext-dark rounded-sm px-2 py-0.5">
                      {type}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05 },
                  tap: { scale: 0.95 },
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="text-primary hover:bg-accent-hovered dark:hover:bg-accent-hovered-dark active:bg-accent-hovered dark:active:bg-accent-hovered-dark bg-accent dark:bg-accent-dark cursor-pointer rounded-md p-1 text-xl font-semibold"
                type="button"
                onClick={Create}
              >
                Create
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-[650px] min-w-[200px] -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait">
          {state.confirm && (
            <motion.div
              key="form"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-secondary dark:bg-secondary-dark relative flex flex-col justify-center gap-5 rounded-b-lg p-5 text-center"
            >
              <div className="bg-tertiary dark:bg-tertiary-dark absolute -top-40 left-0 -z-10 flex h-40 w-full justify-center overflow-hidden rounded-t-lg pt-3">
                <svg
                  width="500"
                  height="155"
                  className="shrink-0"
                  viewBox="0 -10 1100 410"
                >
                  <path
                    id="bca7d782-7e31-494e-97b0-f49b8df7894d-186"
                    data-name="Path 8"
                    d="M923.90791,706.92328h-172.216l-.033-.965-8.223-235.18h188.727Zm-170.284-2h168.352l8.117-232.145h-184.587Z"
                    transform="translate(-139.84793 -192.45672)"
                    className="fill-accent dark:fill-accent-dark"
                  />
                  <g
                    id="e7d5632f-8461-4dcf-9cd9-df8e3f64d5e2"
                    data-name="Group 1"
                  >
                    <rect
                      id="ad932c98-7027-4b28-8e73-a76d8a4136e0"
                      data-name="Rectangle 17"
                      x="639.82597"
                      y="321.89657"
                      width="13.099"
                      height="162.097"
                      className="fill-accent dark:fill-accent-dark"
                    />
                    <rect
                      id="ae1e5d8b-7977-4a56-a24c-fbb057f76b38"
                      data-name="Rectangle 18"
                      x="691.40202"
                      y="321.89657"
                      width="13.099"
                      height="162.097"
                      className="fill-accent dark:fill-accent-dark"
                    />
                    <rect
                      id="bffa0855-fc38-45cc-9e39-6daa1d3e4103"
                      data-name="Rectangle 19"
                      x="742.97801"
                      y="321.89657"
                      width="13.099"
                      height="162.097"
                      className="fill-accent dark:fill-accent-dark"
                    />
                  </g>
                  <path
                    d="M1041.59738,539.83884l-.8457-.53418L826.83762,404.12156l18.55566-29.36182.84571.53418,213.91308,135.18262Zm-212-136.33935,211.377,133.57959,16.418-25.97949-211.376-133.58106Z"
                    transform="translate(-139.84793 -192.45672)"
                    className="fill-accent dark:fill-accent-dark"
                  />
                  <path
                    id="b31113e7-cae2-4653-b248-af5e4acb0a6c-187"
                    data-name="Path 10"
                    d="M989.9499,393.22629a38.459,38.459,0,0,0-58.62,38.07l10.2,6.446a30.344,30.344,0,1,1,28.98,18.321l10.2,6.446a38.459,38.459,0,0,0,9.249-69.283Z"
                    transform="translate(-139.84793 -192.45672)"
                    className="fill-accent dark:fill-accent-dark"
                  />
                  <g
                    id="b91459ce-423d-4e92-a857-d0ba85dc07c7"
                    data-name="Group 6"
                  >
                    <path
                      id="b5ba90e2-8a51-4a77-95c4-5b486c8770ec-191"
                      data-name="Path 114"
                      d="M552.16123,620.2275l-19.54908-20.51237-12.80321,12.202,31.582,33.1382.17738-.169a17.4414,17.4414,0,0,0,.59292-24.65874Z"
                      transform="translate(-139.84793 -192.45672)"
                      fill="#2f2e41"
                    />
                    <path
                      id="b1536285-e66e-494f-8c4f-a2304265e4c3-192"
                      data-name="Path 115"
                      d="M430.39593,450.95329a11.94591,11.94591,0,0,1,5.715-17.4l57.179-145.727,22.288,13.345-63.518,139.8a12.01,12.01,0,0,1-21.664,9.982Z"
                      transform="translate(-139.84793 -192.45672)"
                      fill="#feb8b8"
                    />
                    <path
                      id="acd6249e-4699-4411-813c-091b3a750afe-193"
                      data-name="Path 116"
                      d="M647.42792,461.3983a11.94507,11.94507,0,0,1-10.727-14.85l-84.354-131.869,23.891-10.2,75.836,133.523a12.01,12.01,0,0,1-4.646,23.4Z"
                      transform="translate(-139.84793 -192.45672)"
                      fill="#feb8b8"
                    />
                    <path
                      id="ece4d731-f277-435f-bbc1-e3b70679d22f-194"
                      data-name="Path 117"
                      d="M493.8529,436.36129l14.931,221.913,35.682-3.148,7.34595-163.722,19.94,70.314,43.028,3.148-17.031-139Z"
                      transform="translate(-139.84793 -192.45672)"
                      fill="#2f2e41"
                    />
                    <path
                      id="b91f5bf0-a8c5-41a2-a26e-8e2fd84207c6-195"
                      data-name="Path 118"
                      d="M578.04889,551.2243l-6.3,10.495-44.073,30.434,31.484,16.792s60.869-33.583,55.622-44.078Z"
                      transform="translate(-139.84793 -192.45672)"
                      fill="#2f2e41"
                    />
                    <path
                      id="b0b7866d-f3ba-460a-97cc-8103175b89de-196"
                      data-name="Path 119"
                      d="M462.60693,346.57728l12.421-35a62.4941,62.4941,0,0,1,32.332-35.668h0a89.42706,89.42706,0,0,1,52.484-2.873l4.52,1.122a87.36364,87.36364,0,0,1,33.128,16c7.654,6.034,14.54,13.674,15.153,21.892a.24435.24435,0,0,0,.015.051c2.12,9.292,3.169,57.567,3.169,57.567h-18.7l2.958,65.067-.239-.471s-107.856,20.411-107.856,9.916v-67.168l-2.211-24.32Z"
                      transform="translate(-139.84793 -192.45672)"
                      className="fill-heading dark:fill-heading-dark"
                    />
                    <circle
                      id="bd3b9138-8795-4826-98b2-48d72249760b"
                      data-name="Ellipse 12"
                      cx="423.432"
                      cy="41.59257"
                      r="29.889"
                      fill="#feb8b8"
                    />
                    <path
                      id="e83e2647-99b5-4c80-ac3e-9e5d1f9bc81d-197"
                      data-name="Path 120"
                      d="M567.757,220.64529l23.208.93c2.92-.009,6.108-.112,8.332-2,3.35-2.849,2.789-8.225.995-12.241-5-11.182-16.153-15.188-28.4-14.859s-25.08,4.48-31.675,14.8-8.377,23.352-5.893,35.344a38.534,38.534,0,0,1,31.508-21.97Z"
                      transform="translate(-139.84793 -192.45672)"
                      fill="#2f2e41"
                    />
                  </g>
                  <g
                    id="ff061cc6-72bd-494d-9c36-32e4a4020cd7"
                    data-name="Group 4"
                  >
                    <path
                      id="bc404282-8d4f-43f7-bc12-02f97785eba1-198"
                      data-name="Path 81"
                      d="M705.57123,513.00138l-84.00157-58.87289a3.60743,3.60743,0,0,1-.882-5.01481L686.619,355.0409a3.60743,3.60743,0,0,1,5.01481-.882l84.00156,58.87289a3.60742,3.60742,0,0,1,.882,5.01481l-65.92963,94.07033A3.60742,3.60742,0,0,1,705.57123,513.00138Z"
                      transform="translate(-139.84793 -192.45672)"
                      className="fill-accent dark:fill-accent-dark"
                    />
                    <path
                      id="ae4af9f3-88ec-4cab-9b9e-a4fc234f7062-199"
                      data-name="Path 82"
                      d="M724.46214,449.12032l-49.29069-34.54561a5.30063,5.30063,0,1,1,6.08441-8.6814l49.29069,34.54561a5.30063,5.30063,0,0,1-6.08441,8.6814Z"
                      transform="translate(-139.84793 -192.45672)"
                      className="fill-primary"
                    />
                    <path
                      id="fe48f3fd-992f-41c2-af3b-c30882e26a16-200"
                      data-name="Path 83"
                      d="M713.14975,465.26118l-49.29069-34.54561a5.30063,5.30063,0,1,1,6.0844-8.6814l49.29069,34.54561a5.30063,5.30063,0,0,1-6.0844,8.6814Z"
                      transform="translate(-139.84793 -192.45672)"
                      className="fill-primary"
                    />
                    <path
                      id="e216638f-22ba-49ea-a46c-300c78c4e875-201"
                      data-name="Path 84"
                      d="M701.71568,481.57565,652.425,447.03a5.30063,5.30063,0,1,1,6.0844-8.68141l49.29069,34.54561a5.30063,5.30063,0,0,1-6.0844,8.68141Z"
                      transform="translate(-139.84793 -192.45672)"
                      className="fill-primary"
                    />
                    <path
                      id="ee43e3d8-5f22-4b53-a964-043fec166479-202"
                      data-name="Path 85"
                      d="M724.32359,417.19028l-19.09171-13.38052a5.30063,5.30063,0,1,1,6.0844-8.6814L730.408,408.50887a5.30063,5.30063,0,0,1-6.08441,8.68141Z"
                      transform="translate(-139.84793 -192.45672)"
                      className="fill-primary"
                    />
                  </g>
                </svg>
              </div>
              <span className="text-heading dark:text-heading-dark text-2xl font-bold">
                Are you sure, bun?
              </span>
              <span className="text-subtext dark:text-subtext-dark">
                Double-check! Once deleted,{" "}
                <span className="text-accent dark:text-accent-dark text-xl font-bold">
                  {state.confirmTarget.word.name.toUpperCase()}
                </span>{" "}
                will hop away for good and cannot be recovered.
              </span>
              <div className="flex gap-5">
                <motion.button
                  variants={btnVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="text-heading hover:text-primary active:bg-accent dark:active:bg-accent-dark hover:bg-accent dark:hover:bg-accent-dark dark:text-heading-dark dark:bg-tertiary-dark bg-tertiary w-full cursor-pointer rounded-md p-1 text-xl"
                  type="button"
                  onClick={() => {
                    dispatch({ type: "CONFIRMATION" });
                  }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  variants={btnVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="text-primary bg-error active:bg-error-hovered hover:bg-error-hovered w-full cursor-pointer rounded-md p-1 text-xl"
                  type="button"
                  onClick={() => {
                    Delete(state.confirmTarget.word, state.confirmTarget.index);
                    dispatch({ type: "CONFIRMATION" });
                  }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="dark:bg-primary-dark grid-background bg-primary h-dvh w-screen overflow-hidden pt-8 transition max-lg:pb-25 md:pt-15 lg:px-30">
        <div
          className={`relative flex h-full flex-col items-center justify-center gap-8 px-4 ${(state.open || state.confirm) && "pointer-events-none opacity-30"}`}
        >
          {state.words.length > 0 && (
            <div className="bg-secondary dark:bg-secondary-dark border-accent dark:border-accent-dark flex w-full max-w-[450px] min-w-[200px] items-center gap-4 rounded-md border-2 p-2.5 text-2xl">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-accent dark:text-accent-dark pointer-events-none"
              />
              <input
                placeholder="Search..."
                value={state.search}
                onChange={(e) =>
                  dispatch({ type: "SEARCH", payload: e.target.value })
                }
                type="text"
                className="placeholder:text-subtext dark:placeholder:text-subtext-dark text-heading dark:text-heading-dark w-full outline-none"
              />

              <motion.button
                variants={btnVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => dispatch({ type: "OPEN_FORM" })}
                className="text-primary active:bg-accent-hovered dark:active:bg-accent-hovered-dark bg-accent dark:bg-accent-dark hover:bg-accent-hovered dark:hover:bg-accent-hovered-dark cursor-pointer rounded-md px-5 text-2xl select-none"
              >
                +
              </motion.button>
            </div>
          )}

          <div className="z-30 mb-10 grid max-h-[calc(100vh_-_250px)] auto-rows-min grid-cols-1 gap-5 overflow-x-hidden overflow-y-auto px-3 pb-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {state.words.length === 0 ? (
                <div className="absolute left-1/2 flex w-70 -translate-x-1/2 justify-between text-4xl select-none">
                  <span className="rotate-y-180">🐇</span>
                  <span className="animate-carrot absolute">🥕</span>
                  <span>🐇</span>
                </div>
              ) : (
                filteredWords
                  .sort((a, b) => {
                    const fav = (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
                    if (fav !== 0) return fav;

                    return a.name.localeCompare(b.name);
                  })
                  .map((word, index) => {
                    return (
                      <motion.div
                        variants={{
                          hidden: { scale: 0 },
                          loaded: (i) => ({
                            scale: 1,
                            transition: {
                              delay: i * 0.08,
                              type: "spring",
                              stiffness: 150,
                            },
                          }),
                        }}
                        custom={index}
                        initial="hidden"
                        animate="loaded"
                        exit="hidden"
                        key={word.name}
                        className={`bg-secondary group dark:bg-secondary-dark ${word.favorite ? "border-yellow-600 dark:border-amber-200" : "border-accent dark:border-accent-dark"} relative flex h-60 w-71 flex-col justify-between border-b-4 p-4`}
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
                                  className={`${tagColors[t] || "bg-gray-300"} text-heading rounded-sm px-2 font-semibold select-none`}
                                  key={i}
                                >
                                  {t || "N/A"}
                                </span>
                              );
                            })}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <p
                            className={`text-heading dark:text-heading-dark line-clamp-2 py-1 font-semibold text-balance capitalize ${word.name.length <= 12 ? "text-[2rem]" : word.name.length <= 25 ? "text-[1.8rem]" : word.name.length <= 40 ? "text-2xl" : "text-xl"}`}
                          >
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
                          <motion.a
                            variants={btnVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            target="_blank"
                            href={`https://dictionary.cambridge.org/dictionary/english/${word.name}`}
                            className="ml-auto flex items-center"
                          >
                            <FontAwesomeIcon
                              icon={faLink}
                              className="text-heading dark:text-heading-dark cursor-pointer text-xl hover:text-blue-500 active:text-blue-500"
                            />
                          </motion.a>

                          <motion.button
                            variants={btnVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "CONFIRMATION",
                                payload: { word, index },
                              })
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-heading active:text-error dark:text-heading-dark hover:text-error cursor-pointer text-xl"
                            />
                          </motion.button>

                          <motion.button
                            variants={btnVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            type="button"
                            onClick={() => Favor(word)}
                          >
                            <FontAwesomeIcon
                              icon={faStar}
                              className={`cursor-pointer text-xl ${word.favorite ? "text-yellow-600 dark:text-amber-200" : "text-heading dark:text-heading-dark hover:text-yellow-300 active:text-yellow-300"}`}
                            />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dictionary;
