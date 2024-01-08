// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Icon as _PhosphorIcon } from 'phosphor-react';

import { Theme as _Theme } from '../themes';

export type Theme = _Theme;
export type PhosphorIcon = _PhosphorIcon;

export interface ThemeProps {
  theme: Theme;
  className?: string;
}
