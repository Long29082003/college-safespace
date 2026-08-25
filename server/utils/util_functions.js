const feelingCategories = [
  {
    category: "Sadness & Pain",
    color: "#8691db",
    feelings: ["Sad", "Lonely", "Hurt", "Empty"]
  },
  {
    category: "Stress & Fatigue",
    color: "#878c9b",
    feelings: ["Overwhelmed", "Confused", "Tired", "Stressed", "Pressured", "Drained"]
  },
  {
    category: "Anger & Conflict",
    color: "#e0836e",
    feelings: ["Angry", "Frustrated", "Irritated", "Resentful", "Jealous"]
  },
  {
    category: "Love & Connection",
    color: "#d090a6",
    feelings: ["Loved", "Caring", "Trusting", "Grateful"]
  },
  {
    category: "Joy & Energy",
    color: "#e99964",
    feelings: ["Happy", "Excited", "Hopeful"]
  },
  {
    category: "Growth & Renewal",
    color: "#a9ce8e",
    feelings: ["Relieved", "Motivated", "Inspired"]
  }
];

export const fillerMotivationalMsg = [
  {id: -10, message: "Small steps still move you forwards."},
  {id: -9, message: "The fire stays lit for everyone."},
  {id: -8, message: "The fire remembers every visitor."},
  {id: -7, message: "Even tiny sparks can start a fire."},
  {id: -6, message: "Have a rest. This fire does not need to burn right."},
  {id: -5, message: "Keep the fire going for yourselves too."},
  {id: -4, message: "Leave a spark behind for the next visitor."},
  {id: -3, message: "Someone left this fire going for the next person."},
  {id: -2, message: "Progress can be quiet."},
  {id: -1, message: "Your presence matters here."},
  {id: 0, message: "Come in and take a seat."}
];

//Todo Ask chatgpt to divide the feelings into 6 big categories, then count feelings and put them in respective category
export const sortedCounts = (object) => {
    if (typeof(object) !== "object" || !object) throw new Error("Invalid input");

    const feelingCategoriesCount = feelingCategories.map(category => {
        return {
            ...category,
            count: 0
        };
    });
    const listOfSortedCount = Object.entries(object).sort((a, b) => b[1] - a[1]);
    for (const [feeling, count] of listOfSortedCount) {
        feelingCategoriesCount.forEach((category, index) => {
            if (category.feelings.includes(feeling)) {
                feelingCategoriesCount[index].count += count;
            } else {
                return;
            };
        });
    };

    return feelingCategoriesCount;
};

export const convertDbTimeToUTCString = (string) => {
    return string.replace(" ", "T") + "Z";
}

export const convertUTCStringToDbTime = (string) => {
    const str = string.replace("T", " ");
    return str.slice(0, str.length - 5);
};


export const countPostOnMonth = (posts) => {
    if (!posts) throw new Error("Invalid [posts] argument");

    const months = Array.from({length: 12}, (_, index) => {
      return {
        month: new Date(0, index).toLocaleString("en-US", {month: "short"}),
        count: 0
      };
    });

    posts.forEach(post => {
      const UTCDate = convertDbTimeToUTCString(post["created_at"]);
      const formattedDate = new Date(UTCDate).toLocaleString("en-US", {month: "short"});

      months.forEach((month, index) => {
        if (month.month === formattedDate) months[index]["count"] += 1 
      });
    });

    return months;
};

export const returnStringOfIds = (listOfIds = []) => {
    if (listOfIds.length === 0) return;

    let str = "";
    listOfIds.forEach((id, index) => {
        if (index === listOfIds.length - 1) str += `${id}`;
        else str += `${id},`
    });

    return str;
};