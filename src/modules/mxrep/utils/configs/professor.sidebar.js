export const sidebarConfig = {
    title: {
        iconCode: 11,
        titleMain: "MxRep",
        titleSub: "Professor Panel"
    },
    pages: [
        {
            route: 'manage-games',
            title: 'My Games',
            iconCode: 7
        },
        {
            route: 'manage-groups',
            title: 'Groups',
            iconCode: 8
        },
        {
            route: 'manage-classes',
            title: 'Classes',
            iconCode: 8
        },
        {
            route: 'inbox',
            title: 'Inbox',
            iconCode: 9
        },
        {
            route: 'profile',
            title: 'Profile',
            iconCode: 10
        }
    ],
    defaultRoute: 'manage-games'
}