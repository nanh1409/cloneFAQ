import { InputBase, InputBaseProps, InputProps, TextField, TextFieldProps } from '@mui/material'
import React, { forwardRef, PropsWithoutRef } from 'react'

const AuthInput = forwardRef((props: PropsWithoutRef<InputBaseProps>, ref) => {
  const { ...textFieldProps } = props;
  return (
    <InputBase
      {...(textFieldProps) as InputBaseProps}
      inputRef={ref}
      inputProps={{
        ...textFieldProps.inputProps,
      }}
      sx={{
        ...textFieldProps.sx,
        fontFamily: "inherit"
      }}
    />
  )
})

export default AuthInput