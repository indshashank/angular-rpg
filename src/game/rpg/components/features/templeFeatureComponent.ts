/*
 Copyright (C) 2013-2015 by Justin DuJardin and Contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {GameFeatureComponent} from '../gameFeatureComponent';
import {TileObject} from '../../../pow2/tile/tileObject';

export class TempleFeatureComponent extends GameFeatureComponent {
  cost: string;
  icon: string;

  syncBehavior(): boolean {
    if (!super.syncBehavior() || !this.host.feature) {
      return false;
    }
    this.name = 'Temple';
    this.cost = this.host.feature.cost;
    this.icon = this.host.feature.icon;
    return true;
  }

  enter(object: TileObject): boolean {
    object.scene.trigger('TempleFeatureComponent:entered', this);
    return true;
  }

  exit(object: TileObject): boolean {
    object.scene.trigger('TempleFeatureComponent:exited', this);
    return true;
  }

}
