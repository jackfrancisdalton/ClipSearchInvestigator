import React from 'react';

const AccountSetUp: React.FC<{ error: string }> = ({ error }) => {
    return (
        <div>
            <form>
                <label>Please insert your access key</label>
                <input type="password"/>
                <button>Submit</button>
                {error && <p>Error: Invalid access key</p>}
            </form>
            <p>You can find your access key in your Google account here XXX TODO this guide</p>
        </div>
    );
};

export default AccountSetUp;