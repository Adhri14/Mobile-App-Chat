import { NavigationContainerRef } from "@react-navigation/native";
import { createRef } from "react";
import { RootStackParamList } from "../router";

export let navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();