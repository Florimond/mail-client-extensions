import * as React from "react";
import Login from "./Login/Login"
import Progress from "./Progress";
import Main from "./Main/Main";
import AppContext from './AppContext';
import Partner from "../../classes/Partner";

enum Page {
    Login,
    Main,
}

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
    itemChangedRegister: any;
}

export interface AppState {
    pageDisplayed: Page;
    isLoading: Boolean;
    doReload: Boolean;
    lastLoaded: number;
    loginErrorMessage: string;
    navigation: {
        goToLogin: () => void,
        goToMain: () => void
        },
    partners: Partner[],
    selectedPartner: number,
    setPartners: (p: Partner[], selectedPartner: number, isLoading: Boolean) => void,
    setSelectedPartner: (index: number) => void,
    setPartnerId: (index: number, id: number) => void,
    modules: string[],
    setModules: (modules: string[]) => void,
    connect: (token) => void,
    disconnect: () => void,
    getConnectionToken: () => void,
    isConnected: () => Boolean,
    setIsLoading: (isLoading: Boolean) => void,
    setDoReload: (doReload: Boolean) => void,
    cancelRequests: () => void,
    addRequestCanceller: (canceller: () => void) => void
}

export default class App extends React.Component<AppProps, AppState> {
    requestCancellers: (() => void)[] = [];

    constructor(props, context) {
        super(props, context);

        props.itemChangedRegister(this.itemChanged);

        this.state = {
            isLoading: false,
            doReload: false,
            lastLoaded: Date.now(),
            pageDisplayed: Page.Main,
            loginErrorMessage: "",
            selectedPartner: undefined,

            navigation: {
                goToLogin: this.goToLogin,
                goToMain: this.goToMain
            },
            partners: [new Partner()],
            setPartners: (partners: Partner[], selectedPartner: number, isLoading: Boolean) => {
                const partnersCopy = partners.map(p => Partner.fromJSON(JSON.parse(JSON.stringify(p))));
                this.setState({partners: partnersCopy, selectedPartner: selectedPartner, isLoading: isLoading})
            },
            setSelectedPartner: (index: number) => {
                this.setState({selectedPartner: index});
            },
            setPartnerId: (index: number, id: number) => {
                if (!this.state.selectedPartner) {
                    return;
                }
                let partnersCopy = []
                for (let i = 0; i < this.state.partners.length; ++i) {
                    const partnersCopy = Partner.fromJSON(JSON.parse(JSON.stringify(this.state.partners[i])));
                    if (i === index) {
                        partnersCopy[i].id = id;
                    }
                }
                this.setState({partners: partnersCopy})
            },
            modules: [],
            setModules: (modules: string[]) => {
                this.setState({modules: [...modules]});
            },
            connect: (token) => {
                localStorage.setItem('odooConnectionToken', token);
            },
            disconnect: () => {
                this.setState({modules: []});
                localStorage.removeItem('odooConnectionToken');
            },
            getConnectionToken: () => {
                return 'Bearer ' + localStorage.getItem('odooConnectionToken');
            },
            isConnected: () => {
                return !!localStorage.getItem('odooConnectionToken');
            },
            setIsLoading: (isLoading: Boolean) => {
                this.setState({isLoading: isLoading});
            },
            setDoReload: (doReload: Boolean) => {
                this.setState({
                    doReload: doReload,
                    partners: [new Partner()],
                    modules: []
                });
            },
            cancelRequests: () => {
                const cancellers = [...this.requestCancellers];
                this.requestCancellers = [];
                for (const canceller of cancellers){
                    canceller(); // Cancel the request.
                }
            },
            addRequestCanceller: (canceller: () => void) => {
                this.requestCancellers.push(canceller);
            }
        };
    }

    componentDidMount() {
        this.setState({
        isLoading: false,
        });
    }

    goToLogin = () => {
        this.setState({
        pageDisplayed: Page.Login
        })
    }

    goToMain = () => {
        this.setState({
        pageDisplayed: Page.Main
        })
    }

    itemChanged = () => {
        this.setState({'doReload': true});
        //this.forceUpdate();;
    }

    render() {
        const { title, isOfficeInitialized } = this.props;

        if (!isOfficeInitialized) {
            return (
                <Progress title={title} message="Loading..." />
            );
        }

        switch (this.state.pageDisplayed) {
        case Page.Login:
            return <AppContext.Provider value={this.state}><Login /></AppContext.Provider>
        case Page.Main:
        default:
            return <AppContext.Provider value={this.state}><Main /></AppContext.Provider>;
        }
    }
}
