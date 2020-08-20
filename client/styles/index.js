import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { styled } from '@material-ui/core';

export const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 20,
  padding: '0 20px',
});

export const Background = styled(Toolbar)({
  background: 'linear-gradient(45deg, #FE6242 30%, #FF2445 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'red',
});