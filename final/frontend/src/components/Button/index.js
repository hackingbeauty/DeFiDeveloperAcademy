import React                   from 'react'
import PropTypes               from 'prop-types'
import { Button as MuiButton } from '@material-ui/core'
import { withRouter, Link }    from 'react-router-dom'
import { styles }              from './styles.scss'

const Button = (props) => {
  const {
    children,
    link,
    disabled,
    className,
    staticContext,
    classes,
    variant,
    ...rest
  } = props
  const variantClassName = variant === 'outlined' ? 'outline' : ''
  const mergedClassNames = `btn ${className} ${variantClassName}`
  const mergedClasses = Object.assign({}, classes, { label: 'btn-label ' })
  let html
  const isDisabled = disabled || false

  if (link !== null && !isDisabled) {
    html = (
      <Link to={{ pathname: link }} href={link} {...rest}>
        <MuiButton
          className={mergedClassNames}
          classes={mergedClasses}
          variant={variant}
          {...rest}
        >
          {children}
        </MuiButton>
      </Link>
    )
  } else {
    html = (
      <MuiButton
        className={mergedClassNames}
        classes={mergedClasses}
        disabled={disabled}
        variant={variant}
        {...rest}
      >
        {children}
      </MuiButton>
    )
  }

  return (
    <div className={styles}>
      {html}
    </div>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({}),
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  link: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.string
}

Button.defaultProps = {
  classes: {},
  className: 'btn',
  color: 'default',
  disabled: false,
  link: null,
  onClick: null,
  variant: 'contained'
}

export default withRouter(Button)
