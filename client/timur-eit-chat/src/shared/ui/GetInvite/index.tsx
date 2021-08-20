import React from 'react';
import Button from '@material-ui/core/Button';
import {getInviteLink} from 'shared/utils';
import './style.scss'

const GetInviteButton: React.FC<any> = () => {
    return (
        <Button className='invite-link-button'
            variant='outlined'
            color='primary'
            size='small'
            onClick={() => getInviteLink()}
        >
            Get invite link
        </Button>

    )
}

export default GetInviteButton;
