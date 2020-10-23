import React from 'react';

const footerStyle = {
    textAlign: 'center',
    padding: '20px 0',
}

const Footer = () => {
    return (
        <footer>
            <p style={footerStyle}>© {(new Date()).getFullYear()}, Minhazul Hasan Sohan - All rights reserved</p>
        </footer>
    );
};

export default Footer;