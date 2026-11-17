import axios from 'axios';
import { REQUEST_TIMEOUT_MS } from '../constants/http';

/** Prefixo resolvido pelo proxy do Vite; nunca usar a URL do backend diretamente. */
export const API_PREFIX = '/api';

export const apiClient = axios.create({ baseURL: API_PREFIX, timeout: REQUEST_TIMEOUT_MS });
