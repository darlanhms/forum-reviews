import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body, #__next': {
        width: '100%',
      },
      body: {
        fontFamily: "'Montserrat', sans-serif",
      },
    },
  },
});

export default theme;
