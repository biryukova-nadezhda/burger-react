import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {productRequestAsync} from '../../store/product/productSlice';
import { CatalogProduct } from '../CatalogProduct/CatalogProduct';
import { Container } from '../Container/Container';
import { Order } from '../Order/Order';
import style from './Catalog.module.css';

/* Получем с сервера по активной категории каталог продуктов в виде массива объектов. Для этого ипользуется productSlice
в state  под ключом products*/

export const Catalog = () => {
  /* Воспользуемся диструктуризацией и достанем наш state products, который мы сформировали в store product (смотри файл index.js ->
    store -> reducer -> product). С категорией аналогично. Они нам нужны для отображения каких именно товаров в каталоге*/
  const { products } = useSelector(state => state.product);
  const { category, activeCategory } = useSelector(state => state.category);

  /* Необходимо выполнить запрос, чтобы у нас отображались продукты в каталоге. Для этого сразу создаем диспатч.
  Затем, используя useEffect выполняем запрос, используя диспатч. Передаем туда нашу функцию для запросов
  productRequestAsync, в которую необходимо передать категорию. Чтобы узнать какая именно категория сейчас, используем
  обращение category[activeCategory].title, так как по title активной категории производится запрос.
  Добавляем в массив зависимостей наши category, activeCategory, чтобы при их изменении производился перерендер.

  !!! Так как у нас изначально в category ничего нет, то нужно добавить защиту на такой случай*/
  const dispatch = useDispatch();

  useEffect(() => {
    if(category.length) {
      dispatch(productRequestAsync(category[activeCategory].title))
    }
  }, [category, activeCategory]);

  return (
    <section className={ style.catalog }>
      <Container className={ style.container }>
        <Order />

        <div className={ style.wrapper }>
          <h2 className={ style.title }>{ category[activeCategory]?.rus }</h2>

          <div className={ style.wrap_list }>
            { products.length ? (
              <ul className={ style.list }>
              { products.map(item => (
                <li key={ item.id } className={ style.item }>
                  <CatalogProduct item={ item }/>
                </li>
              )) }
            </ul>
            ) : (
              <p className={ style.empty }>
                К сожалению товаров данной категории нет.
              </p>
            )}

          </div>
        </div>
      </Container>
    </section>
  )
}
