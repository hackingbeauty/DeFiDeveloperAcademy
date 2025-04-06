import { createTheme } from '@material-ui/core/styles'
import { getStyles } from 'core/libs/lib-style-helpers'

const colors = getStyles([
  'error',
  'primary',
  'secondary'
])

const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary
    },
    error: {
      main: colors.error
    }
  },
  typography: {
    useNextVariants: true
  }
})

export default muiTheme
