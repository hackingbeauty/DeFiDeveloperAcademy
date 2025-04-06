import React from 'react'
import { TextField } from '@material-ui/core'

export default function TextInput(props) {
  const {
    ...other
  } = props

  return (<TextField {...other} />)
}

