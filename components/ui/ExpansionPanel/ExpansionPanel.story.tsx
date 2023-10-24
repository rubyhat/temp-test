import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { ExpansionPanel } from './ExpansionPanel';

storiesOf('ui/ExpansionPanel', module)
    .addDecorator(fn => <Card style={{ width: 320 }}>{fn()}</Card>)
    .add('default', () => {
        const Component = () => {
            const [openFirst, setOpenFirst] = useState(false);
            const [openSecond, setOpenSecond] = useState(false);

            return (
                <>
                    <ExpansionPanel
                        title="Место посадки и высадки"
                        opened={openFirst}
                        onClick={() => setOpenFirst(!openFirst)}
                    >
                        <Grid
                            container
                            direction="column"
                            style={{ marginTop: 12, marginBottom: 12 }}
                        >
                            <Grid container direction="row" alignItems="center">
                                <TextField
                                    placeholder="Посадка"
                                    fullWidth
                                    style={{ marginBottom: 12 }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    placeholder="Высадка"
                                    fullWidth
                                    style={{ marginBottom: 12 }}
                                />
                            </Grid>
                        </Grid>
                    </ExpansionPanel>

                    <ExpansionPanel
                        title="Время отправления"
                        opened={openSecond}
                        onClick={() => setOpenSecond(!openSecond)}
                    >
                        <ButtonGroup
                            variant="outlined"
                            color="primary"
                            size="medium"
                            style={{ marginBottom: 12, marginTop: 12 }}
                        >
                            <Button variant="contained">Ночь</Button>
                            <Button>Утро</Button>
                            <Button>День</Button>
                            <Button>Вечер</Button>
                        </ButtonGroup>
                    </ExpansionPanel>
                </>
            );
        };

        return <Component />;
    });
