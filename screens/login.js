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

import styles from "../styles/style";
import AppConstants from "../constants/Constants";

const firebaseAuth = firebase.auth();
const usersCollection = firebase.firestore().collection("users");

export default class LoginScreen extends Component {
	state = {
		signUpChecked: false,
		loginButtonTitle: AppConstants.STRING_LOG_IN,
		username: "",
		password: "",
		confirmPassword: ""
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
												? AppConstants.STRING_SIGN_UP
												: AppConstants.STRING_LOG_IN
										}
									/>
									<Button
										containerStyle={screenStyles.anonymousLogin}
										title={AppConstants.STRING_LOGIN_ANONYMOUSLY}
										onPress={() => this.anonymousLoginClicked()}
									/>
									<CheckBox
										title={AppConstants.STRING_SIGN_UP}
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
		return null;
	}

	componentDidMount() {
		if (firebaseAuth.currentUser) this.navigateToHome()
	}

	navigateToHome = () => this.props.navigation.navigate(AppConstants.STRING_HOME)

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
							onLoginSuccessful(credentials);
							this.navigateToHome();
						},
						createUserError =>
							ToastAndroid.show(createUserError.code, ToastAndroid.SHORT)
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
								ToastAndroid.show(
									AppConstants.TOAST_LOG_IN_SUCCESS,
									ToastAndroid.SHORT
								);
								this.navigateToHome();
							},
							signInError =>
								ToastAndroid.show(signInError.code, ToastAndroid.SHORT)
						);
				} else {
					ToastAndroid.show(
						AppConstants.TOAST_PASSES_DONT_MATCH,
						ToastAndroid.SHORT
					);
					ToastAndroid.show(
						AppConstants.TOAST_ENTER_SAME_PASS,
						ToastAndroid.SHORT
					);
				}
		}
	}

	anonymousLoginClicked = () => {
		firebaseAuth.signInAnonymously().then(
			credentials => {
				usersCollection
					.add({
						uid: credentials.user.uid,
						email: credentials.user.email,
						password: null,
						isAnonymous: credentials.user.isAnonymous,
						providerId: credentials.user.providerId
					})
					.then(docRef => docRef.update({ id: docRef.id }));
				ToastAndroid.show(
					AppConstants.TOAST_LOG_IN_SUCCESS,
					ToastAndroid.SHORT
				);
				this.navigateToHome();
			},
			error => ToastAndroid.show(error.code, ToastAndroid.SHORT)
		);
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

const onLoginSuccessful = credentials => {
	usersCollection
		.add({
			uid: credentials.user.uid,
			email: credentials.user.email,
			isAnonymous: credentials.user.isAnonymous,
			providerId: credentials.user.providerId
		})
		.then(docRef => docRef.update({ id: docRef.id }));
	ToastAndroid.show(AppConstants.TOAST_LOG_IN_SUCCESS, ToastAndroid.SHORT);
};
