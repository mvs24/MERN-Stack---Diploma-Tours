import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Logo from '../assets/logo.PNG';
import './Header.css';
import { IconContext } from 'react-icons';
import { IoIosApps, IoIosSearch, IoIosAirplane } from 'react-icons/io';
import { MdHotel } from 'react-icons/md';
import { FaMapMarkedAlt } from 'react-icons/fa';
import Button from '../shared/components/Button/Button';
import Modal from '../shared/components/UI/Modal';
import Input from '../shared/components/Input/Input';
import {
  signupUser,
  deleteError,
  loginUser,
  getMyWishlist,
  getToursInCart,
  getMyReviews,
  getMyNotifications,
  getUnReadNotifications,
  setCurrentUser,
  setHeaders,
} from '../store/actions/userActions';
import LoadingSpinner from '../shared/components/UI/LoadingSpinner';
import UserContent from '../UserContent/UserContent';
import ErrorModal from '../shared/components/UI/ErrorModal';
import { IoIosArrowDown } from 'react-icons/io';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import axios from 'axios';

const Header = React.memo((props) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [signupData, setSignupData] = useState({
    name: {
      configOptions: {
        type: 'text',
        placeholder: 'Your Name',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
    lastname: {
      configOptions: {
        type: 'text',
        placeholder: 'Your Lastname',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
    email: {
      configOptions: {
        type: 'email',
        placeholder: 'Your E-mail',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        isEmail: true,
      },
    },
    password: {
      configOptions: {
        type: 'password',
        placeholder: 'Your Password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
    passwordConfirm: {
      configOptions: {
        type: 'password',
        placeholder: 'Confirm your password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
  });
  const [loginData, setLoginData] = useState({
    email: {
      configOptions: {
        type: 'email',
        placeholder: 'Your E-mail',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        isEmail: true,
      },
    },
    password: {
      configOptions: {
        type: 'password',
        placeholder: 'Your Password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
  });
  const [signupValid, setSignupValid] = useState(false);
  const [loginValid, setLoginValid] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState();
  const [forgotPasswordEmailValid, setForgotPasswordEmailValid] = useState();
  const [openResetModal, setOpenResetModal] = useState();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState({
    configOptions: {
      type: 'email',
      placeholder: 'Your E-mail',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
      isEmail: true,
    },
  });
  const [resetForm, setResetForm] = useState({
    resetToken: {
      configOptions: {
        type: 'text',
        placeholder: 'Your Token',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 15,
      },
    },
    password: {
      configOptions: {
        type: 'password',
        placeholder: 'Your new password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
    passwordConfirm: {
      configOptions: {
        type: 'password',
        placeholder: 'Confirm your password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
  });
  const [resetFormValid, setResetFormValid] = useState(false);
  const [sendingEmail, setSendingEmail] = useState();
  const [resetError, setResetError] = useState();

  const {
    isAuthenticated,
    getMyWishlist,
    getMyReviews,
    getMyNotifications,
    getUnReadNotifications,
  } = props;

  useEffect(() => {
    if (isAuthenticated) {
      getMyWishlist();
      getMyNotifications();
      getUnReadNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) getMyReviews();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      props.getToursInCart();
    }
  }, [isAuthenticated]);

  const openLoginModal = () => {
    setOpenLogin(true);
  };

  const openSignupModal = () => {
    setOpenSignup(true);
  };

  const checkValidity = (value, requirements) => {
    let isValid = true;

    if (requirements.required) {
      isValid = isValid && value.trim().length !== 0;
    }
    if (requirements.minlength) {
      isValid = isValid && value.trim().length >= requirements.minlength;
    }
    if (requirements.isEmail) {
      isValid = isValid && /\S+@\S+\.\S+/.test(value);
    }

    return isValid;
  };

  const forgotPasswordEmailInputHandler = (e) => {
    const updatedData = { ...forgotPasswordEmail };

    updatedData.value = e.target.value;
    updatedData.touched = true;
    updatedData.valid = checkValidity(
      updatedData.value,
      updatedData.validRequirements
    );

    setForgotPasswordEmail(updatedData);

    let isFormValid = true;
    for (let key in updatedData) {
      isFormValid = isFormValid && updatedData.valid;
    }

    setForgotPasswordEmailValid(isFormValid);
  };

  const resetInputHandler = (e, inputIdentifier) => {
    const updatedData = { ...resetForm };
    const updatedIdentifier = { ...updatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    updatedData[inputIdentifier] = updatedIdentifier;

    console.log(updatedData);

    setResetForm(updatedData);

    let isFormValid = true;
    for (let key in updatedData) {
      isFormValid = isFormValid && updatedData[key].valid;
    }
    console.log(isFormValid);

    setResetFormValid(isFormValid);
  };

  const inputHandler = (e, inputIdentifier, method) => {
    if (method === 'signup') {
      const updatedSignupData = { ...signupData };
      const updatedIdentifier = { ...updatedSignupData[inputIdentifier] };

      updatedIdentifier.value = e.target.value;
      updatedIdentifier.touched = true;
      updatedIdentifier.valid = checkValidity(
        updatedIdentifier.value,
        updatedIdentifier.validRequirements
      );
      updatedSignupData[inputIdentifier] = updatedIdentifier;

      setSignupData(updatedSignupData);

      let isFormValid = true;
      for (let key in updatedSignupData) {
        isFormValid = isFormValid && updatedSignupData[key].valid;
      }

      setSignupValid(isFormValid);
    } else if (method === 'login') {
      const updatedLoginData = { ...loginData };
      const updatedIdentifier = { ...updatedLoginData[inputIdentifier] };

      updatedIdentifier.value = e.target.value;
      updatedIdentifier.touched = true;
      updatedIdentifier.valid = checkValidity(
        updatedIdentifier.value,
        updatedIdentifier.validRequirements
      );
      updatedLoginData[inputIdentifier] = updatedIdentifier;

      setLoginData(updatedLoginData);

      let isFormValid = true;
      for (let key in updatedLoginData) {
        isFormValid = isFormValid && updatedLoginData[key].valid;
      }
      setLoginValid(isFormValid);
    }
  };

  const populateData = (type) => {
    let data = {};

    for (let key in type) {
      data[key] = type[key].value;
    }

    return data;
  };

  const signupHandler = async () => {
    const data = populateData(signupData);
    const success = await props.signupUser(data);

    if (success) setOpenSignup(false);
  };

  const loginHandler = async () => {
    const data = populateData(loginData);
    const success = await props.loginUser(data);

    if (success) setOpenLogin(false);
  };

  const loginModalCloseHandler = () => {
    let updatedLoginData = { ...loginData };

    // <div className="all">
    //       <div className="show">
    //         <IconContext.Provider value={{ className: 'icon' }}>
    //           <IoIosApps />
    //           <span className="categories">Categories</span>
    //         </IconContext.Provider>
    //       </div>

    //       // <div className="hidden__elements">{categoriesToRender}</div>
    //     </div>

    for (let key in updatedLoginData) {
      updatedLoginData[key].value = '';
    }

    setLoginData(updatedLoginData);
    props.deleteError();
    setOpenLogin(false);
  };

  const makeImpactHandler = () => {
    if (!isAuthenticated) {
      setError('You need to be logged in. Please Log In');
    } else {
      props.history.push('/make-an-impact');
    }
  };

  const signupModalCloseHandler = () => {
    let updatedSignupData = { ...signupData };

    for (let key in updatedSignupData) {
      updatedSignupData[key].value = '';
    }

    setSignupData(updatedSignupData);
    props.deleteError();
    setOpenSignup(false);
  };

  const forgotHandler = () => {
    setOpenLogin(false);
    setOpenForgotPasswordModal(true);
  };

  const searchInputHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const searchHandler = (e) => {
    e.preventDefault();

    props.history.push(`/search/${searchInput}`);
    setSearchInput('');
  };

  const forgotEmailHandler = async () => {
    const email = forgotPasswordEmail.value;
    setSendingEmail(true);
    await axios.post(`/api/v1/users/forgotPassword`, { email });
    setSendingEmail(false);
    setOpenResetModal(true);
    setOpenForgotPasswordModal();
  };

  const categories = [
    {
      cmp: <IoIosAirplane />,
      category: 'Flights',
      link: '/categories/flights',
    },
    { cmp: <FaMapMarkedAlt />, category: 'Tours', link: '/categories/tours' },
    { cmp: <MdHotel />, category: 'Hotels', link: '/categories/hotels' },
  ];

  const categoriesToRender = categories.map((el) => (
    <Link key={el.link} to={el.link} className="hidden__element">
      <IconContext.Provider value={{ className: 'icon' }}>
        {el.cmp}
        <span className="flights">{el.category}</span>
      </IconContext.Provider>
    </Link>
  ));

  const loginForm = [];
  for (let key in loginData) {
    loginForm.push(
      <Input
        value={loginData[key].value}
        valid={loginData[key].valid}
        touched={loginData[key].touched}
        configOptions={loginData[key].configOptions}
        onChange={(e) => inputHandler(e, key, 'login')}
      />
    );
  }

  const signupForm = [];
  for (let key in signupData) {
    signupForm.push(
      <Input
        value={signupData[key].value}
        valid={signupData[key].valid}
        touched={signupData[key].touched}
        configOptions={signupData[key].configOptions}
        onChange={(e) => inputHandler(e, key, 'signup')}
      />
    );
  }

  const resetFormInputs = [];
  for (let key in resetForm) {
    resetFormInputs.push(
      <Input
        value={resetForm[key].value}
        valid={resetForm[key].valid}
        touched={resetForm[key].touched}
        configOptions={resetForm[key].configOptions}
        onChange={(e) => resetInputHandler(e, key)}
      />
    );
  }

  const resetConfirmHandler = async () => {
    try {
      let data = {
        password: resetForm.password.value,
        passwordConfirm: resetForm.passwordConfirm.value,
      };
      setLoading(true);
      const res = await axios.patch(
        `/api/v1/users/resetPassword/${resetForm.resetToken.value}`,
        data
      );
      setLoading(false);

      setHeaders(res.data.token);
      await props.setCurrentUser();
      setOpenResetModal();

      setResetError();
    } catch (err) {
      setLoading(false);
      setResetError(true);
    }
  };

  let userContent = (
    <>
      <Button type="success" clicked={openLoginModal}>
        Log In
      </Button>
      <Button type="neutral" clicked={openSignupModal}>
        Sign Up
      </Button>
    </>
  );

  if (props.isAuthenticated) {
    userContent = (
      <UserContent
        unReadNotifications={props.unReadNotifications}
        notifications={props.notifications}
        wishlist={props.wishlist}
        cartTour={props.cartTour}
      />
    );
  }

  return (
    <React.Fragment>
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
      {props.loading && <LoadingSpinner asOverlay />}
      {openResetModal && (
        <Modal
          header="RESET TOKEN. Complete the fields to reset token"
          show
          onCancel={() => {
            setResetError();
            setOpenResetModal();
          }}
        >
          {resetFormInputs}
          {resetError && (
            <p className="reset__error">Your data is not correct...</p>
          )}

          <Button
            disabled={!resetFormValid}
            type="success"
            clicked={resetConfirmHandler}
          >
            Confirm
          </Button>
        </Modal>
      )}
      {openForgotPasswordModal && (
        <Modal
          header="Forgot password"
          show
          onCancel={() => setOpenForgotPasswordModal()}
        >
          <Input
            value={forgotPasswordEmail.value}
            valid={forgotPasswordEmail.valid}
            touched={forgotPasswordEmail.touched}
            configOptions={forgotPasswordEmail.configOptions}
            onChange={(e) => forgotPasswordEmailInputHandler(e)}
          />
          {sendingEmail ? (
            <Button disabled={true} type="success">
              SENDING EMAIL...
            </Button>
          ) : (
            <Button
              disabled={!forgotPasswordEmailValid}
              clicked={forgotEmailHandler}
              type="success"
            >
              Confirm your E-mail
            </Button>
          )}
        </Modal>
      )}

      {openLogin && (
        <Modal
          onCancel={loginModalCloseHandler}
          header={'Log In'}
          footer={
            <Button
              clicked={loginHandler}
              disabled={!loginValid}
              type="success"
            >
              Log In
            </Button>
          }
          show
          headerClass="green"
        >
          {loginForm.map((el) => el)}
          <h1 className="forgot__heading" onClick={forgotHandler}>
            Forgot your password? Click here to get the code.
          </h1>

          {props.error && <h2 className="errorText">{props.error}</h2>}
        </Modal>
      )}

      {openSignup && !openLogin && (
        <Modal
          onCancel={signupModalCloseHandler}
          header={'Sign Up'}
          footer={
            <Button
              clicked={signupHandler}
              disabled={!signupValid}
              type="success"
            >
              Sign Up
            </Button>
          }
          show
          headerClass="green"
        >
          {signupForm.map((el) => el)}

          {props.error && <h2 className="errorText">{props.error}</h2>}
        </Modal>
      )}
      <header className="header">
        {props.error && <ErrorModal>{props.error}</ErrorModal>}
        <img
          style={{ cursor: 'pointer' }}
          onClick={() => props.history.push('/')}
          className="logo"
          src={Logo}
          alt="Logo"
        />
        <h2
          style={{ cursor: 'pointer' }}
          onClick={() => props.history.push('/')}
          className="heading-2"
        >
          Trillo
        </h2>

        <form onSubmit={searchHandler} className="searchForm">
          <input
            value={searchInput}
            onChange={searchInputHandler}
            type="text"
            className="search"
            placeholder="Search anything"
          />
          <IconContext.Provider value={{ className: 'icon search__icon' }}>
            <IoIosSearch onClick={searchHandler} />
          </IconContext.Provider>
        </form>
        <span
          style={{ cursor: 'pointer' }}
          onClick={makeImpactHandler}
          className="impact"
        >
          Make an impact
        </span>
        {userContent}
      </header>
    </React.Fragment>
  );
});

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  error: state.user.error,
  loading: state.user.loading,
  isAuthenticated: state.user.isAuthenticated,
  wishlist: state.user.wishlist,
  cartTour: state.user.cartTour,
  notifications: state.user.notifications,
  unReadNotifications: state.user.unReadNotifications,
});

export default connect(mapStateToProps, {
  signupUser,
  deleteError,
  loginUser,
  getMyWishlist,
  getToursInCart,
  getMyReviews,
  getMyNotifications,
  getUnReadNotifications,
  setCurrentUser,
})(withRouter(Header));
