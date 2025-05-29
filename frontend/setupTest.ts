import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// extend jest-dome matchers to include support for custom matchers like "toBeInTheDocument" in all tests
expect.extend(matchers);
