import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CourseApp from './CourseApp';
import store from './Store.js';

ReactDOM.render(
    <Provider store={store}>
        <CourseApp />
    </Provider>,
    document.getElementById('root')
);