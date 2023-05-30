import React from 'react';
function Version () {}
function Changelog(props) {
    return (
        <div>
            <h1>Changelog</h1>
            <ul>
                <li>
                    <h2>Version : 0.1.0</h2>
                    <h3>changes</h3>
                    <ul>
                        <li>Application is in a basic but working state</li>
                    </ul>
                    <h3>upcoming features</h3>
                    <ul>
                        <li>Different Views</li>
                        <li>
                            Support for displaying previous data for
                            hardrives that have been in the system multiple times
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default Changelog;