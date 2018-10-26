import { observable, action, decorate } from 'mobx';

class AppStore {
    notification = null;

    searchText = null;

    appColor = null;

    isNightMode = null;

    isAutoGifs = null;

    isTeamsSidebarOpen = true;

    constructor() {
        const { isnightmode, appcolor, isautogifs } = localStorage;
        this.isNightMode = isnightmode === 'true';
        this.appColor = appcolor || 0;
        this.isAutoGifs = isautogifs === 'true';
    }

    toggleTeamsSidebar = () => {
        this.isTeamSidebarOpen = !this.isTeamSidebarOpen;
    }

    toggleNightMode = () => {
        this.isNightMode = !this.isNightMode;
        localStorage.setItem('isnightmode', this.isNightMode);
    }

    toggleAutoGifs = () => {
        this.isAutoGifs = !this.isAutoGifs;
        localStorage.setItem('isautogifs', this.isAutoGifs);
    }

    changeAppColor = (val) => {
        this.appColor = val;
        localStorage.setItem('appcolor', this.appColor);
    }

    createNotification = (text) => {
        this.notification = text;
    }

    deleteNotification = () => {
        this.notification = null;
    }

    updateSearchText = (text) => {
        this.searchText = text;
    }
}

decorate(AppStore, {
    isNightMode: observable,
    appColor: observable,
    notification: observable,
    searchText: observable,
    isAutoGifs: observable,
    isTeamSidebarOpen: observable,
    toggleNightMode: action,
    changeAppColor: action,
    createNotification: action,
    removeNotification: action,
    updateSearchText: action,
    toggleTeamsSidebar: action,
    toggleAutoGifs: action,
});

export default AppStore;
