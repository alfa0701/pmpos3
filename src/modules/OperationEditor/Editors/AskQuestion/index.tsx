import * as React from 'react';
import { TextField, Button } from 'material-ui';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import Typography from 'material-ui/Typography/Typography';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui/styles/withStyles';
import { Map as IMap } from 'immutable';
import EditorProperties from '../editorProperties';
import { RuleManager } from 'pmpos-modules';

interface State {
    question: string;
    parameters: {};
    parameterState: IMap<string, any>;
}

type Props = EditorProperties<{ question: string, parameters: Object }> & WithStyles<keyof Style>;

class Component extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            question: '',
            parameters: {},
            parameterState: IMap<string, any>()
        };
    }

    componentWillReceiveProps(props: Props) {
        let current = props.current;
        if (current) {
            Object.keys(current.parameters).forEach(key => {
                if (current) {
                    let value = current.parameters[key];
                    if (Array.isArray(value)) {
                        this.setState({ parameterState: this.state.parameterState.set(key, '') });
                    } else {
                        this.setState({ parameterState: this.state.parameterState.set(key, value) });
                    }
                }
            });
        }
    }

    componentDidMount() {
        if (this.props.current) {
            this.setState({
                question: this.props.current.question,
                // "parameters":{"Name":"","Age":["1","2","3"]}
                parameters: this.props.current.parameters as {}
            });
        }
    }

    getParamEditor(key: string, value: any) {
        if (Array.isArray(value)) {

            return (
                <div key={key}>
                    <Typography variant="body2">{key}</Typography>
                    <div className={this.props.classes.buttonContainer}>
                        {(Array(...value).map(item => (
                            <Button
                                color={this.state.parameterState.get(key) === item ? 'secondary' : 'default'}
                                key={item} variant="raised" className={this.props.classes.selectionButton}
                                onClick={e => this.setState({
                                    parameterState: this.state.parameterState.set(key, item)
                                })}
                            >
                                {item}
                            </Button>
                        )))}
                    </div>
                </div >
            );
        }
        return <TextField label={key} key={key} type={this.getEditorType(key)}
            value={this.getTextValue(key)}
            onChange={e => this.setTextValue(key, e.target.value)} />;
    }

    getEditorType(key: string): string {
        let val = this.state.parameters[key];
        let isNumber = !isNaN(parseFloat(val)) && isFinite(val);
        return isNumber ? 'number' : 'text';
    }

    getTextValue(key: string) {
        return this.state.parameterState.get(key) || '';
    }

    setTextValue(key: string, value: any) {
        this.setState({ parameterState: this.state.parameterState.set(key, value) });
    }

    render() {
        return (
            <div>
                <DialogTitle>{this.state.question}</DialogTitle>
                <DialogContent style={{ display: 'flex', flexFlow: 'column' }}>
                    {Object.keys(this.state.parameters)
                        .map(key => this.getParamEditor(key, this.state.parameters[key]))}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            if (this.props.current) {
                                Object.keys(this.props.current.parameters).map(key => {
                                    let value = this.state.parameterState.get(key);
                                    RuleManager.setState(key, value);
                                });
                            }
                            this.props.success(this.props.actionName, this.props.current);
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </div>
        );
    }
}

export default decorate(Component);