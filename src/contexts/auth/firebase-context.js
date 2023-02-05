import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { firebaseApp } from '../../libs/firebase';
import { Issuer } from '../../utils/auth';
import {authApi} from "../../api/auth";
import {useDispatch} from "react-redux";

const auth = getAuth(firebaseApp);

var ActionType;
(function (ActionType) {
  ActionType['AUTH_STATE_CHANGED'] = 'AUTH_STATE_CHANGED';
})(ActionType || (ActionType = {}));

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const reducer = (state, action) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
};

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.Firebase,
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const reduxDispatch = useDispatch()
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAuthStateChanged = useCallback((user) => {
    if (user) {
      // Here you should extract the complete user profile to make it available in your entire app.
      // The auth state only provides basic information.
      dispatch({
        type: ActionType.AUTH_STATE_CHANGED,
        payload: {
          isAuthenticated: true,
          user: {
            id: user.uid,
            avatar: user.photoURL || undefined,
            email: user.email || 'anika.visser@devias.io',
            name: 'Anika Visser',
            plan: 'Premium'
          }
        }
      });
    } else {
      dispatch({
        type: ActionType.AUTH_STATE_CHANGED,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);

  useEffect(() => onAuthStateChanged(auth, handleAuthStateChanged),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const _signInWithEmailAndPassword = useCallback(async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password).catch(e => {throw mapAuthCodeToMessage(e.code)})
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  }, []);

  const _createUserWithEmailAndPassword = async (email, password, confirmPassword) => {
    if (password !== confirmPassword){
      throw new Error("passwords do not match")
    }
    await authApi.register({email, password, confirmPassword})
        .then(response => {
          signInWithCustomToken(auth, response)
              .then((cred) => {
                const user = cred.user
              }).catch((error) => {
            throw error
          });
        }).catch(error => {
          throw error
        })
  };

  function mapAuthCodeToMessage(authCode) {
    switch (authCode) {
      case "auth/too-many-requests":
        return "Too many sign in attempts, try again in a few minutes"

      case "auth/user-not-found":
        return "No user with this email"

      case "auth/wrong-password":
        return "Incorrect email/password combination";

      case "auth/invalid-email":
        return "Invalid email address";

      case "auth/user-disabled" :
        return "This account has not yet been activated, you will receive an email when the review process has been completed"

      default:
        return "Something went wrong, try again later";
    }
  }

  const _signOut = useCallback(async () => {
    await signOut(auth).then(() => {

    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.Firebase,
        createUserWithEmailAndPassword: _createUserWithEmailAndPassword,
        signInWithEmailAndPassword: _signInWithEmailAndPassword,
        signInWithGoogle,
        signOut: _signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
