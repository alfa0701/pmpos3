import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { CardTypeRecord } from '../../models/CardType';

type PageProps =
    {
        isLoading: boolean
        cardType: CardTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface PageState {
    name: string;
    reference: string;
    displayFormat: string;
    commands: string;
}

export class CardTypePage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = { name: '', reference: '', commands: '', displayFormat: '' };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({
                name: props.cardType.name,
                reference: props.cardType.reference,
                displayFormat: props.cardType.displayFormat,
                commands: props.cardType.commands.join('\n')
            });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.cardType) {
            this.setState({
                name: this.props.cardType.name,
                reference: this.props.cardType.reference,
                displayFormat: this.props.cardType.displayFormat,
                commands: this.props.cardType.commands.join('\n')
            });
        }
    }

    getTitle() {
        return this.props.cardType.name ? `Card Type (${this.props.cardType.name})` : 'New Card Type';
    }

    public render() {
        if (this.props.isLoading || !this.props.cardType) { return <div>Loading</div>; }
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.getTitle()}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'delete',
                            menuItems: [{
                                icon: 'Confirm',
                                onClick: () => {
                                    this.props.deleteCardType(this.props.cardType.id);
                                    this.props.history.goBack();
                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.saveCardType(new CardTypeRecord({
                                    id: this.props.cardType.id,
                                    name: this.state.name,
                                    reference: this.state.reference,
                                    displayFormat: this.state.displayFormat,
                                    commands: this.state.commands.split('\n')
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <TextField
                        label="Card Type Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({
                            name: e.target.value
                        })}
                    />

                    <TextField
                        label="Reference"
                        value={this.state.reference}
                        onChange={(e) => this.setState({
                            reference: e.target.value
                        })}
                    />

                    <TextField
                        label="Display Format"
                        value={this.state.displayFormat}
                        onChange={(e) => this.setState({
                            displayFormat: e.target.value
                        })}
                    />

                    <TextField
                        multiline
                        label="Commands"
                        value={this.state.commands}
                        onChange={(e) => this.setState({
                            commands: e.target.value
                        })}
                    />
                </Paper >
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    cardType: state.config.currentCardType,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(CardTypePage));