import React, { Component } from "react";
import {
	Keyboard,
	Text,
	View,
	TextInput,
	TouchableWithoutFeedback,
	StyleSheet,
	KeyboardAvoidingView,
	ToastAndroid,
	ScrollView
} from "react-native";
import { Button, CheckBox } from "react-native-elements";
import firebase from "react-native-firebase";
import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';

import styles from "../styles/style";
import AppConstants from "../constants/Constants";
import Strings from '../constants/Strings'
import Toasts from '../constants/Toasts'
import FirebaseAuthErrorCode from "../constants/FirebaseAuthErrorCode"
import reactotron from "../../ReactotronConfig";

const firebaseAuth = firebase.auth();
const usersCollection = firebase.firestore().collection("users");
const blackListCollection = firebase.firestore().collection('blacklist')

export default class LoginScreen extends Component {
	state = {
		signUpChecked: false,
		loginButtonTitle: Strings.STRING_LOG_IN,
		username: "",
		password: "",
		confirmPassword: "",
	};

	focusPasswordInput = () => {
		this._passwordInput.focus();
	};

	focusConfirmPasswordInput = () => {
		this._confirmPasswordInput.focus();
	};

	render() {
		if (!firebaseAuth.currentUser)
			return (
				<View style={screenStyles.container}>
					<NavigationEvents
						onDidFocus={() => this.onDidFocus()}
						onWillBlur={() => this.onWillBlur()}
					/>
					<ScrollView
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: "center"
						}}
					>
						<KeyboardAvoidingView style={styles.containerView}>
							<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
								<View style={styles.loginScreenContainer}>
									<Text style={styles.logoText}>{AppConstants.APP_NAME}</Text>
									<TextInput
										ref={component => (this._email = component)}
										value={this.state.username}
										placeholder='E-mail'
										placeholderColor='#c4c3cb'
										style={styles.loginFormTextInput}
										returnKeyType='next'
										onSubmitEditing={event => this.focusPasswordInput()}
										onChangeText={this.usernameChanged}
									/>
									<TextInput
										ref={component => (this._passwordInput = component)}
										value={this.state.password}
										placeholder='Password'
										placeholderColor='#c4c3cb'
										returnKeyType={this.state.signUpChecked ? "next" : "go"}
										onSubmitEditing={event => this.onPasswordSubmitted()}
										style={styles.loginFormTextInput}
										secureTextEntry={true}
										onChangeText={this.passwordChanged}
									/>
									<TextInput
										ref={component => (this._confirmPasswordInput = component)}
										value={this.state.confirmPassword}
										placeholder='Confirm password'
										placeholderColor='#c4c3cb'
										returnKeyType='go'
										onSubmitEditing={event => this.onConfirmPasswordSubmitted()}
										style={
											this.state.signUpChecked
												? styles.loginFormTextInput
												: styles.hideLoginFormTextInput
										}
										secureTextEntry={true}
										onChangeText={this.confirmPasswordChanged}
									/>
									<Button
										buttonStyle={styles.loginButton}
										containerStyle={{ marginHorizontal: 8 }}
										onPress={() => this.onLoginPress()}
										title={
											this.state.signUpChecked
												? Strings.STRING_SIGN_UP
												: Strings.STRING_LOG_IN
										}
									/>
									<Button
										containerStyle={screenStyles.anonymousLogin}
										title={Strings.STRING_LOGIN_ANONYMOUSLY}
										onPress={() => this.anonymousLoginClicked()}
									/>
									<CheckBox
										title={Strings.STRING_SIGN_UP}
										containerStyle={screenStyles.signUpChkBx}
										checked={this.state.signUpChecked}
										onPress={() => this.signUpPressed(this.state.signUpChecked)}
									/>
								</View>
							</TouchableWithoutFeedback>
						</KeyboardAvoidingView>
					</ScrollView>
				</View>
			);
		return (
			<NavigationEvents
				onDidFocus={() => this.onDidFocus()}
				onWillBlur={() => this.onWillBlur()}
			/>
		)
}

	componentDidMount() {
	}

	onDidFocus = () => {
		this.manageAccountStatus()
    }

    onWillBlur = () => {
    }


	navigateToHome = () => this.props.navigation.navigate(Strings.STRING_HOME)

	manageAccountStatus = () => {
		if(firebaseAuth.currentUser) {
			blackListCollection.where('id', '==', firebaseAuth.currentUser.uid).get().then(
				(querySnapshot) => {
					if(querySnapshot.empty) {
						this.navigateToHome()
					}
				})
				.catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))
		}
	}

	signUpPressed(currentStatus) {
		this.setState({ signUpChecked: !currentStatus });
		this._email.focus();
		this._email.blur();
		this._passwordInput.blur();
		this._confirmPasswordInput.blur();
	}

	onLoginPress() {
		if (!this.state.signUpChecked) {
			if (this.state.username && this.state.password) {
				firebaseAuth
					.signInWithEmailAndPassword(this.state.username, this.state.password)
					.then(
						credentials => {
							this.goToHome();
						},
						signInError =>
							this.onSignInError(signInError.code)
					);
			}
		} else {
			if (
				this.state.username &&
				this.state.password &&
				this.state.confirmPassword
			)
				if (this.state.password === this.state.confirmPassword) {
					firebaseAuth
						.createUserWithEmailAndPassword(
							this.state.username,
							this.state.password
						)
						.then(
							credentials => {
								this.onSignUpSuccessful(credentials)
							},
							signUpError =>
								this.onSignUpError(signUpError.code)
						);
				} else {
					ToastAndroid.show(
						Toasts.TOAST_PASSES_DONT_MATCH,
						ToastAndroid.SHORT
					);
					ToastAndroid.show(
						Toasts.TOAST_ENTER_SAME_PASS,
						ToastAndroid.SHORT
					);
				}
		}
	}

	anonymousLoginClicked = async () => {
		try {
			const credentials = await firebaseAuth.signInAnonymously()
			const userInfo = {
				uid: credentials.user.uid,
				email: credentials.user.email,
				isAnonymous: credentials.user.isAnonymous,
				providerId: credentials.user.providerId
			}
			await usersCollection.doc(credentials.user.uid).set(userInfo)
			this.goToHome()
		} catch (error) {
			ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT)
		}
	};

	onPasswordSubmitted = event => {
		if (this.state.signUpChecked) this.focusConfirmPasswordInput();
		else this.onLoginPress();
	};

	onConfirmPasswordSubmitted = event => {
		this.onLoginPress();
	};

	usernameChanged = usernameText => {
		this.setState({ username: usernameText });
	};

	passwordChanged = passwordText => {
		this.setState({ password: passwordText });
	};

	confirmPasswordChanged = confirmPasswordText => {
		this.setState({ confirmPassword: confirmPasswordText });
	};

	onSignInError = (errorCode) => {
		switch(errorCode) {
			case FirebaseAuthErrorCode.USER_DISABLED:
				ToastAndroid.show(Toasts.TOAST_USER_DISABLED, ToastAndroid.SHORT)
				break;

			case FirebaseAuthErrorCode.INVALID_EMAIL:
				ToastAndroid.show(Toasts.TOAST_INVALID_EMAIL, ToastAndroid.SHORT)
				break;

			case FirebaseAuthErrorCode.USER_NOT_FOUND:
				ToastAndroid.show(Toasts.TOAST_USER_NOT_FOUND, ToastAndroid.SHORT)
				ToastAndroid.show(Toasts.TOAST_PLEASE_SIGNUP, ToastAndroid.SHORT)
				break;

			case FirebaseAuthErrorCode.WRONG_PASSWORD:
				ToastAndroid.show(Toasts.TOAST_WRONG_PASSWORD, ToastAndroid.SHORT)
				break;
		}
	}

	onSignUpError = (errorCode) => {
		switch(errorCode) {
			case FirebaseAuthErrorCode.EMAIL_ALREADY_IN_USE:
				ToastAndroid.show(Toasts.TOAST_EMAIL_ALREADY_IN_USE, ToastAndroid.SHORT)
				ToastAndroid.show(Toasts.TOAST_LOGIN_INSTEAD, ToastAndroid.SHORT)
				break;

			case FirebaseAuthErrorCode.INVALID_EMAIL:
				ToastAndroid.show(Toasts.TOAST_INVALID_EMAIL, ToastAndroid.SHORT)
				break;

			case FirebaseAuthErrorCode.OPERATION_NOT_ALLOWED:
				ToastAndroid.show(Toasts.TOAST_OPERATION_NOT_ALLOWED, ToastAndroid.SHORT)
				break;

			case FirebaseAuthErrorCode.WEAK_PASSWORD:
				ToastAndroid.show(Toasts.TOAST_WEAK_PASSWORD, ToastAndroid.SHORT)
				ToastAndroid.show(Toasts.TOAST_DIFFICULT_PASSWORD, ToastAndroid.SHORT)
				break;
		}
	}

	goToHome = () => {
		this.navigateToHome();
		ToastAndroid.show(Toasts.TOAST_LOG_IN_SUCCESS, ToastAndroid.SHORT);
	};

	onSignUpSuccessful = async credentials => {
		try {
			const userInfo = {
				uid: credentials.user.uid,
				email: credentials.user.email,
				isAnonymous: credentials.user.isAnonymous,
				providerId: credentials.user.providerId
			}
			await usersCollection.doc(credentials.user.uid).set(userInfo)
			this.goToHome()
		} catch (error) {
			ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT)
		}
	}
}

const screenStyles = StyleSheet.create({
	container: {
		flex: 1
	},
	anonymousLogin: {
		marginTop: 16,
		marginHorizontal: 8
	},
	signUpChkBx: {
		alignSelf: "center",
		borderWidth: 0
	}
});

LoginScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
}
