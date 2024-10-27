import { HOST } from '@/util/constants';
import axios from 'axios';

export const apiClient = axios.create({
	baseURL: HOST,
});
