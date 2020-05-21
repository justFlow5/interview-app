import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, withRouter } from 'react-router-dom';

import Tooltip from '@material-ui/core/Tooltip';

import { firebase, googleAuthProvider } from '../../firebase/base';

import { validateEmail } from '../utils/helperFunctions';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import { device } from '../utils/media';

import GoogleIcon from '../../images/googleIcon';

import AnonimousIcon from '../../images/anonimousIcon';

import InterviewPic from '../../images/interviewPic.jpg';
import InterviewPic2 from '../../images/happyInterview.jpg';
import InterviewPic3 from '../../images/studying.jpg';

import clover from '../../images/clover2.png';

import {
  handleGoogleLogin,
  handleAnonimousLogin,
} from '../../firebase/firebaseFuntions';

const rotate = keyframes`
0% {
    transform: rotateY(360deg);
  }
  100% {
    transform: rotateY(0rem);
  }
`;

const fadeIn = keyframes`
0% {
  transform: scale(0);
  opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const PageCointainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #e6e6fa;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const PicWrapperLeft = styled.div`
  display: none;
  @media ${device.laptop} {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    & .left-top-pic {
      /* margin-left: 35px; */
      width: 210px;
      height: 150px;
      align-self: flex-start;
      @media ${device.laptopL} {
        width: 250px;
        height: 160px;
      }
    }
    & .left-bottom-pic {
      /* margin-left: 35px; */
      width: 295px;
      height: 190px;
      align-self: flex-end;
      @media ${device.laptopL} {
        width: 350px;
        height: 220px;
      }
    }
  }
`;

const PicWrapperRight = styled.div`
  display: none;
  @media ${device.laptop} {
    display: flex;
    align-items: center;
    & .right-center-pic {
      width: 335px;
      height: 240px;
      margin-bottom: 40px;
      @media ${device.laptopL} {
        width: 375px;
        height: 260px;
      }
    }
  }
`;

const InterviewPic1 = styled.img`
  width: 300px;
  height: 200px;
  /* position: fixed; */
  border-radius: 50%;
  /* opacity: 0.6; */
  -webkit-box-shadow: 0px 0px 29px 0px rgba(60, 153, 220, 1);
  -moz-box-shadow: 0px 0px 29px 0px rgba(60, 153, 220, 1);
  box-shadow: 0px 0px 29px 0px rgba(60, 153, 220, 1);
  opacity: 0.7;
  /* opacity: 1; */
  transition: all 0.3s;
  /* &:hover {
    transform: scale(1.07);
    opacity: 0.8;
  } */
`;

const SignInUpWrapper = styled.div`
  margin-top: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const LogoHolder = styled.div`
  text-align: center;
  /* margin: 5px auto 25px; */
  position: relative;
  /* left: -10px; */
  /* position: fixed; */
  margin-bottom: 15px;

  cursor: pointer;

  @media ${device.mobileS} {
    margin-bottom: 20px;
  }

  @media ${device.mobileM} {
    margin-bottom: 45px;
  }
  & span {
    font-family: 'Merienda', cursive;
    font-size: 45px;
    color: #113ee0;

    @media ${device.mobileM} {
      font-size: 55px;
    }

    @media ${device.mobileM} {
      font-size: 65px;
    }
    @media ${device.tablet} {
      font-size: 70px;
    }
  }
  & img {
    display: inline-block;
    /* margin: 0 auto; */
    /* width: 200px; */
    width: 55px;
    pointer-events: none;
    animation: ${rotate} 0.7s ease-out 1s;

    @media ${device.mobileM} {
      width: 75px;
    }
    @media ${device.tablet} {
      width: 80px;
    }
  }
`;

const SignIpUpWindow = styled.div`
  width: 85vw;
  /* min-height: 79vh; */
  border: 1px solid #a8a8a8;
  border-radius: 6px;
  background: #add8e6;
  background: #fff;
  /* margin-top: 150px; */
  position: relative;
  -webkit-box-shadow: 0px 0px 20px -6px rgba(0, 0, 128, 1);
  -moz-box-shadow: 0px 0px 20px -6px rgba(0, 0, 128, 1);
  box-shadow: 0px 0px 20px -6px rgba(0, 0, 128, 1);

  @media ${device.mobileM} {
    /* min-height: 65vh; */
  }
  @media ${device.mobileL} {
    /* font-size: 65px; */
  }

  @media ${device.mobileL} {
    /* max-width: 50vw;
    height: 65vh; */
    max-width: 85vw;
    /* height: 75vh; */
  }
  @media (min-width: 540px) {
    /* max-width: 50vw;
    height: 65vh; */
    max-width: 70vw;
    /* min-height: 75vh; */
  }
  @media ${device.tablet} {
    width: 70vw;
    /* max-height: 55vh; */
  }
  @media ${device.laptop} {
    width: 30vw;
    /* max-height: 20vh; */
  }
`;

const TitleContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 15px auto 0;

  @media ${device.mobileM} {
    /* margin: 20px auto 35px; */
    margin: 20px auto 20px;
  }
`;

const Title = styled.h3`
  font-size: 28px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.6px;
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > .wrapper {
    margin-top: 20px;
    position: relative;
    flex: 1 1 0;
    width: 70%;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  &.alternative {
    padding-bottom: 42px;
    @media ${device.mobileM} {
      padding-bottom: 50px;
    }
    @media ${device.mobileL} {
      padding-bottom: 60px;
    }

    @media ${device.tablet} {
      padding-bottom: 70px;
    }
    @media ${device.laptop} {
      padding-bottom: 80px;
    }

    @media ${device.laptopL} {
      padding-bottom: 50px;
    }
  }
`;

const Button = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 70%;
  font-size: 16px;
  height: 40px;

  @media ${device.tablet} {
    font-size: 17px;
  }
  /* line-height: 40px; */
`;

const PassButton = styled(Button)`
  margin: 30px auto 0;
  font-weight: 500;
  background: #3063ffe0;
  font-size: 18px;
  color: #fff;
  transition: all 0.3s;
  &:hover {
    background: #3063ff;
    /* background: -webkit-linear-gradient(to right, #2948ff, #396afc);
    background: linear-gradient(to right, #2948ff, #396afc); */
  }
`;

const Separator = styled.div`
  margin: 15px auto;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
`;

const GoogleButton = styled(Button)`
  background: #e6e6fa;
  transition: all 0.3s;
  &:hover {
    background: #bdd4bc;
  }
  & svg {
    width: 23px;
    margin-right: 10px;
  }
`;

const AnonimousButton = styled(Button)`
  background: #707070;
  background: #b8b8b8;
  margin-top: 10px;
  transition: all 0.3s;
  &:hover {
    background: #a8a8a8;
  }
  & svg {
    width: 23px;
    display: inline-block;
    margin-right: 10px;
  }
`;

const Footer = styled.div`
  width: 70%;
  margin: 10px auto 0;
  margin-top: auto;
  text-align: center;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  position: absolute;
  bottom: 10px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  /* margin-top: 5px; */
  padding-top: 10px;

  @media ${device.mobileL} {
    margin: 10px auto 5px;
  }

  & span {
    color: black;
    font-size: 12px;
    @media ${device.mobileL} {
      font-size: 14px;
    }
    &:hover {
      text-decoration: underline;
      color: #87bdd8;
    }
  }
`;

// function CssTextField(props) {
//   return (
//     <TextField
//       variant="outlined"
//       id={props.name}
//       label={props.label}
//       name={props.name}
//       type={props.type}
//       fullWidth
//       required
//       value={props.value}
//       onChange={props.handleChange(props.name)}
//     />
//   );
// }

{
  /* <CssTextField
                id="outlined-basic"
                label="Password"
                name="password"
                type="password"
                value={password}
            
                onChange={handleChange}
              /> */
}

const PicContainer = styled.div`
  /* display: inline-block; */
  position: relative;
  padding: 30px;
  opacity: 0;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
  animation-duration: 0.3s;
  &#pic-container-two {
    animation-delay: 0.3s;
  }
  &#pic-container-three {
    animation-delay: 0.6s;
  }
  &:hover > img {
    /* animation-fill-mode: forwards; */
    transform: scale(1.05);
    opacity: 0.85;
  }
  &:hover .top-left-text {
    opacity: 1;
    transform: translateX(-20px);
    @media ${device.laptopL} {
      transform: translateX(-40px);
    }
  }
  &:hover .top-right-text {
    opacity: 1;
    transform: translateX(10px);
  }
  &:hover .rightside-top-text {
    opacity: 1;
    transform: translateX(-60px);
  }
  &:hover .rightside-bottom-text {
    opacity: 1;
    transform: translateX(10px);
  }
`;

const Slogan = styled.p`
  /* display: inline-block; */
  /* font-family: 'Permanent Marker', cursive; */
  font-family: 'Merienda', cursive;
  font-size: 32px;
  font-weight: 600;
  opacity: 0;
  position: absolute;
  /* bottom: -10px; */
  word-break: keep-all;
  color: #133863;
  transform: translateX(0);
  transition: all 0.3s cubic-bezier(0.08, 1.17, 0.96, 0.94);
  @media ${device.laptopL} {
    font-size: 36px;
  }
  &.top-right-text {
    top: -20px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  &.top-left-text {
    top: -40px;
    right: 50%;
    -webkit-transform: translateX(50%);
    transform: translateX(50%);
  }
  &.rightside-top-text {
    top: -40px;
    right: 50%;
    -webkit-transform: translateX(50%);
    transform: translateX(50%);
  }
  &.rightside-bottom-text {
    bottom: -40px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
`;

const SignInUpScheme = ({ title, history }) => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push('/');
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push('/dashboard');
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const handleAction = (e, actionType) => {
    if (actionType === 'Login') {
      handleLogin(e);
    } else if (actionType === 'Sign up') {
      handleSignUp(e);
    }
  };

  const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: '#396afc',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#609CE1',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#609CE1',
        },
        '&:hover fieldset': {
          borderColor: '#396afc',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#396afc',
        },
      },
    },
  })(TextField);

  return (
    <PageCointainer>
      {/* <ContentContainer> */}
      <PicWrapperLeft>
        {' '}
        <PicContainer>
          <InterviewPic1 src={InterviewPic3} className="left-top-pic" />
          <Slogan className="top-right-text">Prepare</Slogan>
        </PicContainer>
        <PicContainer id="pic-container-two">
          <InterviewPic1 src={InterviewPic} className="left-bottom-pic" />
          <Slogan className="top-left-text">Go for it</Slogan>
        </PicContainer>
      </PicWrapperLeft>

      <SignInUpWrapper>
        <LogoHolder>
          <Link to="/">
            <img src={clover} alt="clover" /> <span>Bodo</span>
          </Link>
        </LogoHolder>
        <SignIpUpWindow>
          <TitleContainer>
            <Title>{title}</Title>
          </TitleContainer>
          <Form
            onSubmit={(e) => {
              handleAction(e, title);
            }}
            validate
          >
            <div className="wrapper">
              <CssTextField
                id="asdsafadsdfad434"
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                required
              />
            </div>
            <div className="wrapper">
              <CssTextField
                id="sdfskdfbeklrj"
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                required
              />
            </div>
            <ButtonContainer>
              <PassButton type="submit">
                {title === 'Login' ? 'Login' : 'Create account'}
              </PassButton>
            </ButtonContainer>
          </Form>

          <Separator>OR</Separator>
          <ButtonContainer className="alternative">
            <GoogleButton onClick={handleGoogleLogin}>
              {/* <span> */}
              <GoogleIcon />
              Login with Google
              {/* </span> */}
            </GoogleButton>
            <Tooltip
              title="Some functionality of the app will be disabled"
              placement="right"
            >
              <AnonimousButton onClick={handleAnonimousLogin}>
                <AnonimousIcon />
                Login Anonimously
              </AnonimousButton>
            </Tooltip>
          </ButtonContainer>
          <Footer>
            <>
              {title === 'Login' ? (
                <Link to="/sign-up">
                  <span>Can't login? &#183; Sign up for an account</span>
                </Link>
              ) : (
                <Link to="/login">
                  <span>Already have an account? &#183; Log In</span>
                </Link>
              )}
            </>
          </Footer>
        </SignIpUpWindow>
      </SignInUpWrapper>
      <PicWrapperRight>
        <PicContainer id="pic-container-three">
          <InterviewPic1 src={InterviewPic2} className="right-center-pic" />{' '}
          <Slogan className="rightside-top-text">Take</Slogan>
          <Slogan className="rightside-bottom-text">What you deserve</Slogan>
        </PicContainer>
      </PicWrapperRight>
      {/* </ContentContainer> */}
    </PageCointainer>
  );
};

export default withRouter(SignInUpScheme);
