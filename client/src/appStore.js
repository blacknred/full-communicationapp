import { observable, action, decorate } from 'mobx';

class AppStore {
    notification = null;

    searchText = null;

    appColor = null;

    isSoundsOn = true;

    isNightMode = false;

    isAutoGifs = true;

    isTeamsSidebarOpen = true;

    isChannelSidebarOpen = false;

    constructor() {
        const {
            isnightmode, appcolor, isautogifs, issoundson,
        } = localStorage;
        this.isNightMode = isnightmode === 'true';
        this.appColor = parseInt(appcolor, 10) || 0;
        this.isAutoGifs = isautogifs === 'true';
        this.isSoundsOn = issoundson === 'true';
    }

    toggleTeamsSidebar = () => {
        this.isTeamsSidebarOpen = !this.isTeamsSidebarOpen;
    }

    toggleChannelSidebar = () => {
        this.isChannelSidebarOpen = !this.isChannelSidebarOpen;
    }

    toggleNightMode = () => {
        this.isNightMode = !this.isNightMode;
        localStorage.setItem('isnightmode', this.isNightMode);
    }

    toggleSoundsOn = () => {
        this.isSoundsOn = !this.isSoundsOn;
        localStorage.setItem('issoundson', this.isSoundsOn);
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
    appColor: observable,
    notification: observable,
    searchText: observable,
    isAutoGifs: observable,
    isNightMode: observable,
    isSoundsOn: observable,
    isTeamsSidebarOpen: observable,
    isChannelSidebarOpen: observable,
    toggleNightMode: action,
    changeAppColor: action,
    createNotification: action,
    removeNotification: action,
    updateSearchText: action,
    toggleTeamsSidebar: action,
    toggleChannelSidebar: action,
    toggleAutoGifs: action,
    toggleSoundsOn: action,
});

export default AppStore;
