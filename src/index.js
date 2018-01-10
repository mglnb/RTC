import $ from 'jquery';
import add from './sample';
import './styles.scss';

const app = $('#App');
const sum = add(1, 2);
app.html(`Hello World! 1 + 2 = ${sum}`);
