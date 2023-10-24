import React from 'react';
import { storiesOf } from '@storybook/react';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import PersonIcon from '@material-ui/icons/Person';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import Typography from '@material-ui/core/Typography';
import WifiIcon from '@material-ui/icons/Wifi';

import { ListSubheader } from '../ListSubheader';
import { List } from './List';

storiesOf('ui/List', module)
    .add('actions', () => (
        <List>
            <ListItem button>
                <ListItemText primary="Title" />
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem button>
                <ListItemText primary="Транспорт" />
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={
                            <Typography color="textSecondary">
                                Микроавтобус
                            </Typography>
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem button>
                <ListItemText primary="Title" />
                <ListItemSecondaryAction>
                    <IconButton edge="end">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem button>
                <ListItemText primary="Title" secondary="Subtitle" />
                <ListItemSecondaryAction>
                    <IconButton edge="end">
                        <MyLocationIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem button>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Title" secondary="Subtitle" />
                <ListItemSecondaryAction>
                    <IconButton edge="end">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />
        </List>
    ))
    .add('list', () => (
        <List subheader={<ListSubheader>Удобства</ListSubheader>}>
            <ListItem>
                <ListItemIcon>
                    <WifiIcon />
                </ListItemIcon>

                <ListItemText primary="Wi-Fi" />
            </ListItem>

            <Divider component="li" variant="inset" />

            <ListItem>
                <ListItemIcon>
                    <PersonalVideoIcon />
                </ListItemIcon>

                <ListItemText primary="Телевизор" />
            </ListItem>

            <Divider component="li" variant="inset" />
        </List>
    ));
