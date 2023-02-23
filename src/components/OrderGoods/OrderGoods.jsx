import { Count } from '../Count/Count';
import style from './OrderGoods.module.css';

export const OrderGoods = (props) => {
  return (
    <li className={ style.item }>
      <img className={ style.image } src="img/burger_1.jpg" alt={ props.title } />

      <div className={ style.goods }>
        <h3 className={ style.title }>{ props.title }</h3>

        <p className={ style.weight }>512г</p>

        <p className={ style.price }>1279
          <span className="currency">₽</span>
        </p>
      </div>

      <Count count={ 3 }/>
    </li>
  )
};
