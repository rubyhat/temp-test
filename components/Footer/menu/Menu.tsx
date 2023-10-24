import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Typography,
} from '@material-ui/core';
import { useStyles } from './styles';
import Link from 'next/link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { FooterMenuItem } from '../hook';

interface FooterMenuProps {
    menu: Array<FooterMenuItem>;
    isMobile: boolean;
}

export const FooterMenu = ({ menu, isMobile }: FooterMenuProps) => {
    const classes = useStyles();
    if (isMobile) {
        return (
            <div className={classes.accordion}>
                {menu.map(({ title, links: menuLinks }, index) => (
                    <Box key={title}>
                        <Accordion
                            classes={{ root: classes.accordionRoot }}
                            elevation={0}
                            defaultExpanded={index === 0}
                        >
                            <AccordionSummary
                                classes={{
                                    root: classes.accordionSummaryRoot,
                                    content: classes.accordionSummaryContent,
                                }}
                                expandIcon={
                                    <ExpandMoreIcon
                                        classes={{
                                            root: classes.accordionArrowIcon,
                                        }}
                                    />
                                }
                            >
                                <Typography
                                    className={classes.accordionSummeryType}
                                >
                                    {title}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails
                                classes={{ root: classes.accordionDetailsRoot }}
                            >
                                <div className={classes.accordionDetailsInner}>
                                    {menuLinks.map(
                                        ({ label, href, target }, index) => (
                                            <Link key={index} href={href}>
                                                <a
                                                    href={href}
                                                    className={
                                                        classes.accordionLink
                                                    }
                                                    target={target}
                                                >
                                                    {label}
                                                </a>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                ))}
            </div>
        );
    }

    return (
        <Grid
            container
            wrap="nowrap"
            // spacing={3}

            alignItems="flex-start"
        >
            {menu.map(({ title, links: menuLinks }) => (
                <Grid item xs={4} key={title} className={classes.menuColumn}>
                    <Typography className={classes.menuTitle}>
                        {title}
                    </Typography>
                    {menuLinks.map(({ label, href, target }, index) => (
                        <Link key={index} href={href}>
                            <a
                                href={href}
                                className={classes.accordionLink}
                                target={target}
                            >
                                {label}
                            </a>
                        </Link>
                    ))}
                </Grid>
            ))}
        </Grid>
    );
};
