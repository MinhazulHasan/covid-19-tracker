import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

const InfoBox = ({ title, cases, total, active, isGreen, isRed, isYellow, ...props }) => {
    return (
        <Card 
            className={`infoBox ${active && `infoBox--green`} ${isRed && 'infoBox--red'} ${isYellow && 'infoBox--yellow'}`}
            onClick={props.onClick}
        >
            <CardContent>
                <Typography className='infoBox__title' color='textSecondary'>{title}</Typography>
                <h2 className={`infoBox__cases ${isRed && 'text--red'} ${isYellow && 'text--yellow'} ${isGreen && 'text--green'}`}>{cases}</h2>
                <Typography className='infoBox__total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    );
};

export default InfoBox;