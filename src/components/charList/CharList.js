import React, { Component } from 'react';
import Spinner from '../../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210
    }

    marvelService = new MarvelService();
    itemRefs = [];

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharlistLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharlistLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9

        }));
        this.itemRefs = Array(this.state.charList.length + newCharList.length)
        .fill()
        .map((_, i ) => this.itemRefs[i] || React.createRef());
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items = arr.map((item,i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={this.itemRefs[i]}
                    onClick={() => this.props.onCharSelected(item.id)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' || e.key === ' '){
                            this.props.onCharSelected(item.id)
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const { charList, loading, error, offset, newItemLoading } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled = {newItemLoading}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;