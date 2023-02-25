import classNames from 'classnames';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {API_URI} from '../../const';
import { categoryRequestAsync, changeCategory } from '../../store/category/categorySlice';
import { Container } from '../Container/Container';
import style from './Navigation.module.css';

export const Navigation = () => {

  const {category, activeCategory} = useSelector((state) => state.category);
  const dispatch = useDispatch();

  /* Если мы ничего не передаем вторым параментом, то при каждом рендере будет запускаться этот эффект
  Если передаем, например [activeCategory], то если в activeCategory что-то измениться, то и сработает функция, переданная первым параметром
  Если же передаем пустой массив, то вызов произойдет один раз при первом рендере Navigation */
  useEffect(() => {
    dispatch(categoryRequestAsync('max'));
  }, []);

  return (
    <nav className={style.navigation}>
      <Container className={style.container}>
        <ul className={style.list}>
          {category.map((item, i) => (
            <li key={ item.title } className={ style.item }>
              <button
                className={classNames(
                  style.button,
                  activeCategory === i ? style.button_active : '')}
                style={{ backgroundImage: `url(${API_URI}/${item.image})` }}
                onClick={() => dispatch(changeCategory({indexCategory: i}))}
              >
                {item.rus}
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
};
