import {Injectable, Inject, forwardRef} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import {ResourceLoader} from '../../game/pow-core/resourceLoader';
import {GameWorld} from './gameWorld';
import {GameTileMap} from '../../game/gameTileMap';
import {CombatEncounter} from '../models/combat/combat.model';
import {getMapUrl} from '../../game/pow2/core/api';
import {TiledTMXResource} from '../../game/pow-core/resources/tiled/tiledTmx';

@Injectable()
export class CombatService {

  constructor(@Inject(forwardRef(() => GameWorld)) private gameWorld: GameWorld,
              private resourceLoader: ResourceLoader) {
  }

  private _combatMap$ = new ReplaySubject<GameTileMap>(1);
  combatMap$: Observable<GameTileMap> = this._combatMap$;

  loadCombatMap(combatZone: string): Observable<GameTileMap> {
    const mapUrl = getMapUrl('combat');
    return Observable.fromPromise(this.resourceLoader.load(mapUrl)
      .then((maps: TiledTMXResource[]) => {
        if (!maps[0] || !maps[0].data) {
          return Promise.reject('invalid resource: ' + mapUrl);
        }
        const inputs = {
          resource: maps[0]
        };
        return this.gameWorld.entities.createObject('GameCombatMap', inputs);
      })
      .then((g: GameTileMap) => {
        // Hide all layers that don't correspond to the current combat zone
        g.getLayers().forEach((l) => {
          l.visible = (l.name === combatZone);
        });
        g.dirtyLayers = true;
        this._combatMap$.next(g);
        return g;
      }));
  }

  loadEncounter(encounter: CombatEncounter): Observable<CombatEncounter> {
    return this.loadCombatMap(encounter.zone).map(() => encounter);
  }

  attack(from: Being, to: Being) {

  }
}
