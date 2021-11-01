const client = {
    STATIC : {
        DAY_OF_WEEK : [
            "شنبه",
            "یک‌شنبه",
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه",
            "پنج‌شنبه",
            "جمعه",
          ],
          command : ['note' , 'reminder'],
          overHourMessage : {
              ALMOST : "Almost Done!",
              HALF : "Pass The Half",
              DONE : "Completed!",
              BEGGING : "Beginning",
          },
          slogan : "Manage your life wisely!",
          loginWelcome : "Welcome to Target platform",
          notFoundPageText : "There is no page with this path , Are you lost ?",
          INJECTED_TODO : "injectedTodo",
          TODAY_ID : "todayHabit",
          HABIT_LIST_ID : "habitList",
          hours : new Array(24).fill().map((_, i) => i + 1),
          commendScreenSize : {
              note : 100,
              reminder : 50
          }
    },
    nodeRef : {
        home : () => document.querySelector(".home")
    },
    menuList : [
        {
            name : "Stream",
            path : "/",
            color : "865858"
        },
        {
            name : "Target",
            path : "/target",
            color : "889EAF"
        },
        {
            name : "Profile",
            path : "/profile",
            color : "7F8B52"
        },
        {
            name : "Schedule",
            path : "/habitPerWeek",
            color : "D9CAB3"
        },
    ]
}


export default Object.preventExtensions(client)