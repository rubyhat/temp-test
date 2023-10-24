import React from 'react';
import MailIcon from '@material-ui/icons/Mail';
import { storiesOf } from '@storybook/react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Badge } from './Badge';
import { Button } from 'components/ui/Button/Button';

const useStyles = makeStyles((theme: Theme) => ({
    margin: {
        margin: theme.spacing(2),
    },
}));

storiesOf('ui/Badge', module)
    .addDecorator(fn => {
        const Component = () => {
            const classes = useStyles();

            return <div className={classes.margin}>{fn()}</div>;
        };

        return <Component />;
    })
    .add('with icon', () => (
        <Badge badgeContent={5} color="primary">
            <MailIcon />
        </Badge>
    ))
    .add('position', () => (
        <Badge
            badgeContent={5}
            color="primary"
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom',
            }}
        >
            <MailIcon />
        </Badge>
    ))
    .add('with button', () => (
        <Badge badgeContent={5} color="primary">
            <Button variant="contained">Button</Button>
        </Badge>
    ))
    .add('square', () => (
        <Badge badgeContent={5} color="primary" variant="square">
            <Button variant="contained">Button</Button>
        </Badge>
    ));
