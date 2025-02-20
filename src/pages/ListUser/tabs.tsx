import React from 'react';
import Followers from './Followers';
import Following from './Following';

const tabs = [
    {
        key: 0,
        title: "Pengikut",
        ref: React.createRef(),
        children: ({ userId }: { userId: string }) => <Followers userId={userId} />
    },
    {
        key: 1,
        title: "Mengikuti",
        ref: React.createRef(),
        children: ({ userId }: { userId: string }) => <Following userId={userId} />
    },
];

export {
    tabs,
}