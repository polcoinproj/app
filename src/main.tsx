import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./auth/login";
import { Register } from "./auth/register";
import { Info } from "./account/info";
import { NetworkErrorScreen } from "./errorScreen/network";
import { SuccessRegistrationScreen } from "./successScreen/successRegistration";
import { ContactAddScreen } from "./account/addContact";
import { useRecoilState } from "recoil";
import {
    credentialsState,
    tokenState,
    CredentialsStateType,
} from "./state/credentials";
import { TransferScreen } from "./operation/transfer";
import { SuccessTransferScreen } from "./successScreen/transfer";
import { SettingsScreen } from "./account/settings";
import { AchievementRequestScreen } from "./operation/achievementRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AchievementsApprovementScreen } from "./adminPanel/achievements";

const Stack = createStackNavigator();

export function Main() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={((): string => {
                    const [token, _] = useRecoilState(tokenState);
                    const [credentials, _1] = useRecoilState(credentialsState);
                    const credentialsTyped: CredentialsStateType =
                        credentials as CredentialsStateType;

                    return credentialsTyped.login != "" &&
                        credentialsTyped.password != "" &&
                        token != ""
                        ? "AccountInfo"
                        : "Register";
                })()}
            >
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Login" component={Login} />

                <Stack.Screen name="AccountInfo" component={Info} />
                <Stack.Screen name="AddContact" component={ContactAddScreen} />
                <Stack.Screen
                    name="OperationTransfer"
                    component={TransferScreen}
                />
                <Stack.Screen name="Settings" component={SettingsScreen} />

                <Stack.Screen
                    name="AchievementRequest"
                    component={AchievementRequestScreen}
                />

                <Stack.Screen
                    name="ErrorScreenNetwork"
                    component={NetworkErrorScreen}
                />

                <Stack.Screen
                    name="SuccessScreenRegistration"
                    component={SuccessRegistrationScreen}
                />
                <Stack.Screen
                    name="SuccessScreenTransfer"
                    component={SuccessTransferScreen}
                />
                <Stack.Screen
                    name="AchievementsApprovement"
                    component={AchievementsApprovementScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
