/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Skill } from 'domain/Skill';
import { List, Map } from 'immutable';
import DomainObjectView from 'domain/DomainObjectView';
import { AppState } from '../types';

export const getSkillById = (state: AppState, id: number): Skill => {
  if (state.skillList.isLoading) {
    throw Error('Skill list is loading');
  }
  return state.skillList.skillMapById.get(id) as Skill;
};


let oldSkillMapById: Map<number, DomainObjectView<Skill>>| null = null;
let skillListForOldSkillMapById: List<Skill> | null = null;

export const getSkillList = (state: AppState): List<Skill> => {
  if (state.skillList.isLoading) {
    return List();
  }
  if (oldSkillMapById === state.skillList.skillMapById && skillListForOldSkillMapById !== null) {
    return skillListForOldSkillMapById;
  }

  const out = state.skillList.skillMapById.keySeq().map(key => getSkillById(state, key))
    .sortBy(skill => skill.name).toList();

  oldSkillMapById = state.skillList.skillMapById;
  skillListForOldSkillMapById = out;
  return out;
};
