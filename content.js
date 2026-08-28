/*
MASTER CONTENT FILE
===================
This is the main file you edit.

1. Add a sister/cousin inside PEOPLE.
2. Put their photos in photos/<id>/ and list the filenames in photos.
3. Change letter, reward and level/stats.
4. Upload the whole folder to your hosting (for example GitHub Pages).

Example photo path:
photos/durva/01.jpg
*/

const MASTER = {
  yourName: "Your Name",

  people: [
    {
      id: "durva",
      name: "Durva",
      relationship: "Sister",
      intro: "A little Rakhi surprise made especially for you. ❤️",

      // Add as many photos as you like.
      photos: [
        { src: "photos/durva/01.jpg", caption: "One of my favourite memories with you. ❤️" },
        { src: "photos/durva/02.jpg", caption: "Too much chaos in one picture. 😂" },
        { src: "photos/durva/03.jpg", caption: "And somehow we still survived each other." }
      ],

      letter:
`Dear Durva,

Happy Raksha Bandhan! ❤️

I just wanted to remind you how lucky I am to have you in my life.

Thank you for all the memories, laughs, arguments, and little moments that somehow become the best memories.

No matter where life takes us, I hope we always have each other's backs.

Happy Rakhi! 🧵❤️

— Your Name`,

      reward: {
        title: "One Treat Is Officially Owed",
        text: "You have unlocked one ice cream / chocolate / treat of your choice. 😌"
      },

      level: {
        score: 99,
        status: "IRREPLACEABLE SISTER",
        memories: 100,
        chaos: 94,
        arguments: 87
      }
    },

    {
      id: "devangi",
      name: "Devangi",
      relationship: "Cousin",
      intro: "Your personalized Rakhi journey is ready. 🌸",
      photos: [
        { src: "photos/devangi/01.jpg", caption: "A memory worth keeping forever. ❤️" },
        { src: "photos/devangi/02.jpg", caption: "The good old chaos. 😂" }
      ],
      letter:
`Dear Devangi,

Happy Raksha Bandhan! ❤️

From childhood memories to all the moments we've shared, I'm really glad you're part of the family and part of my story.

Keep smiling, keep being you, and don't forget that you've always got me.

Happy Rakhi! 🧵

— Your Name`,
      reward: {
        title: "Cousin Reward Unlocked",
        text: "One snack / coffee / treat together — your choice. 🎁"
      },
      level: {
        score: 96,
        status: "FOREVER FAMILY",
        memories: 98,
        chaos: 89,
        arguments: 70
      }
    }
  ]
};