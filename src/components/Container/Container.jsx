import style from './Container.module.css';
import classNames from 'classnames';

export const Container = ({ children, className }) => {
  return (
    <div className={ classNames(className, style.container) }>
      { children }
    </div>
  )
};
