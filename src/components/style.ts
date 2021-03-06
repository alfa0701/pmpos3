import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    list: any;
    draggableList: any;
    sectionList: any;
    button: any;
    highlightedButton: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    list: {
        flex: 1,
        overflow: 'auto',
        marginTop: spacing.unit
    },
    draggableList: {
        flex: 1,
        overflow: 'auto',
        backgroundColor: palette.background.paper
    },
    sectionList: {
        padding: 0,
        backgroundColor: palette.background.paper
    },
    button: {
        flex: '1 1 auto',
        margin: 2,
        fontSize: '1.4em',
        maxWidth: '48.5%',
        maxHeight: '53%',
        [breakpoints.up('sm')]: {
            margin: 4,
            minWidth: 100
        },
    },
    highlightedButton: {

    }
}));