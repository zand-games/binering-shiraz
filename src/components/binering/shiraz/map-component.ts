import { LitElement, html, css, PropertyValueMap } from 'lit';
import { StoreSubscriber } from 'lit-svelte-stores';
import { customElement, property, state } from 'lit/decorators.js';
import { GameStore } from '../store';
import { Coordination } from '../../../types/binering/Game';

@customElement('map-component')
export class MapComponent extends LitElement {
  game = new StoreSubscriber(this, () => {
    return GameStore;
  });

  locations: Array<Coordination> = [];
  @property({ type: Array }) set coordination(coord: Array<Coordination>) {
    this.locations = coord;
  }

  static get styles() {
    return [
      css`
        #btndownload {
          position: fixed;
          top: 30px;
          left: 30px;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
          z-index: 500;
        }
        #btnshowboard {
          position: fixed;
          top: 30px;
          left: 160px;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
          z-index: 500;
        }
        .canvasContainer {
          position: fixed;
          left: 0px;
          right: 0px;
          top: 0;
          bottom: 0;
          z-index: 1;
          background-color: Black;
        }

        .contextCanvas {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0px;
          top: 0px;
          z-index: 1;
        }
        .data {
          position: fixed;
          top: 30px;
          right: 50px;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none; /* Standard */
          z-index: 501;
          font-size: 0.5em;
          font-family: 'sans-serif', 'Serif';
        }
        .data a {
          text-decoration: none;
        }
      `,
    ];
  }

  firstUpdated() {
    var canvas = this.shadowRoot?.getElementById('map') as HTMLCanvasElement;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    this.draw();
  }
  @property()
  show_board_game: boolean = true;
  show_hide_board_game() {
    this.show_board_game = !this.show_board_game;
    const event = new CustomEvent('boardStatus', {
      detail: {
        status: this.show_board_game,
      },
    });
    this.dispatchEvent(event);
  }
  render() {
    return html`
      <button id="btnshowboard" @click="${this.show_hide_board_game}">
        ${this.show_board_game ? 'Hide Board' : 'Show Board'}
      </button>
      <button id="btndownload" @click="${this.download}">Download Map</button>
      <div class="data nonselectable">
        <a
          class="location"
          target="_blank"
          href="${this.game.value.goole_map_current_location}"
          >Last location on google map!
        </a>
      </div>
      <div class="canvasContainer">
        <canvas id="map" class="contextCanvas"></canvas>
      </div>

      ${this.add_new_location(
        this.game.value.latitute,
        this.game.value.longtitude
      )}
    `;
  }

  iCANVAS_START_X_POS = 0;
  iCANVAS_START_Y_POS = 0;
  iCANVAS_HEIGHT = window.innerHeight; //790;
  iCANVAS_WIDTH = window.innerWidth; //1580;
  iSPACE_FOR_LABEL = 30;
  iMAP_START_X_POS = this.iCANVAS_START_X_POS + this.iSPACE_FOR_LABEL;
  iMAP_START_Y_POS = this.iCANVAS_START_Y_POS + this.iSPACE_FOR_LABEL;
  iMAP_HEIGHT = this.iCANVAS_HEIGHT - this.iSPACE_FOR_LABEL * 2;
  iMAP_WIDTH = this.iCANVAS_WIDTH - this.iSPACE_FOR_LABEL * 2;

  add_new_location(lat: string, long: string) {
    //this.plotPosition();
    this.draw();
  }

  download() {
    var canvas = this.shadowRoot?.getElementById('map') as HTMLCanvasElement;
    if (!canvas) return;
    var img = canvas.toDataURL('image/png');
    var link = document.createElement('a');
    link.download = 'shiraz-game.png';
    link.href = img;
    link.click();
  }
  drawBackground(ctx: any) {
    // Black background
    ctx.fillStyle = 'rgb(0,0,0)';

    // Draw rectangle for the background
    ctx.fillRect(
      this.iCANVAS_START_X_POS,
      this.iCANVAS_START_Y_POS,
      this.iCANVAS_START_X_POS + this.iCANVAS_WIDTH,
      this.iCANVAS_START_Y_POS + this.iCANVAS_HEIGHT
    );

    ctx.stroke();
  }

  drawMapBackground(ctx: any) {
    // Ocean blue colour!
    ctx.fillStyle = 'rgb(232, 234, 255)';

    // Draw rectangle for the map
    ctx.fillRect(
      this.iMAP_START_X_POS,
      this.iMAP_START_Y_POS,
      this.iMAP_WIDTH,
      this.iMAP_HEIGHT
    );
  }

  degreesOfLatitudeToScreenY(iDegreesOfLatitude: any) {
    // Make the value positive, so we can calculate the percentage
    var iAdjustedDegreesOfLatitude = iDegreesOfLatitude * 1 + 90,
      iDegreesOfLatitudeToScreenY = 0;

    // Are we at the South pole?
    if (iAdjustedDegreesOfLatitude === 0) {
      // Screen Y is the botton of the map (avoid divide by zero)
      iDegreesOfLatitudeToScreenY = this.iMAP_HEIGHT + this.iMAP_START_Y_POS;
    } else if (iAdjustedDegreesOfLatitude > 180) {
      // Are we at the North pole (or beyond)?
      // Screen Y is the top of the map
      iDegreesOfLatitudeToScreenY = this.iMAP_START_Y_POS;
    } else {
      // Convert the latitude value to screen X
      iDegreesOfLatitudeToScreenY =
        this.iMAP_HEIGHT -
        iAdjustedDegreesOfLatitude * (this.iMAP_HEIGHT / 180) +
        this.iMAP_START_Y_POS;
    }

    return iDegreesOfLatitudeToScreenY;
  }

  drawLongitudeLines(ctx: any, iDEGREES_BETWEEN_GRID_LINES: any) {
    ctx.beginPath();
    ctx.lineWidth = 0.07;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.setLineDash([10]);

    var iNORTH_LATITUDE = 90,
      iSOUTH_LATITUDE = -90,
      iDegreesScreenY = 0,
      iLineOfLatitude;

    // Iterate around the latitude axis at the given interval
    for (
      iLineOfLatitude = iNORTH_LATITUDE;
      iLineOfLatitude >= iSOUTH_LATITUDE;
      iLineOfLatitude -= iDEGREES_BETWEEN_GRID_LINES
    ) {
      // Convert the latitude value and move the pen to the start of the line
      iDegreesScreenY = this.degreesOfLatitudeToScreenY(iLineOfLatitude);
      ctx.moveTo(this.iMAP_START_X_POS, iDegreesScreenY);
      // Plot the line
      ctx.lineTo(this.iMAP_START_X_POS + this.iMAP_WIDTH, iDegreesScreenY);

      // Put the label on the line

      ctx.fillText(
        iLineOfLatitude,
        this.iCANVAS_START_X_POS + 5,
        iDegreesScreenY - 5
      );

      ctx.stroke();
      ctx.closePath();
    }
  }

  degreesOfLongitudeToScreenX(iDegreesOfLongitude: any) {
    // Make the value positive, so we can calculate the percentage
    var iAdjustedDegreesOfLongitude = iDegreesOfLongitude * 1 + 180,
      iDegreesOfLongitudeToScreenX = 0;

    // Are we at the West -180 point?
    if (iAdjustedDegreesOfLongitude === 0) {
      // Screen X is the left of the map (avoid divide by zero)
      iDegreesOfLongitudeToScreenX = this.iMAP_START_X_POS;
    } else if (iAdjustedDegreesOfLongitude > 360) {
      // If the longitude crosses the 180 line fix it (doesn't translat to screen well)
      iDegreesOfLongitudeToScreenX = this.iMAP_START_X_POS + this.iMAP_WIDTH;
    } else {
      // Convert the longitude value to screen X
      iDegreesOfLongitudeToScreenX =
        this.iMAP_START_X_POS +
        iAdjustedDegreesOfLongitude * (this.iMAP_WIDTH / 360);
    }

    return iDegreesOfLongitudeToScreenX;
  }

  degToRad(angle: any) {
    // Degrees to radians
    return (angle * Math.PI) / 180;
  }

  radToDeg(angle: any) {
    // Radians to degree
    return (angle * 180) / Math.PI;
  }

  drawLatitudeLines(ctx: any, iDEGREES_BETWEEN_GRID_LINES: any) {
    ctx.beginPath();
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillStyle = 'white'; //'rgb(255,255,255)';
    ctx.setLineDash([10]);

    var iMIN_LONGITUDE = -180,
      iMAX_LONGITUDE = 180,
      iDegreesScreenY = 0,
      iLineOfLongitude,
      iDegreesScreenX,
      iCentralMeridian = this.degToRad(0),
      iRadius = this.iMAP_HEIGHT / 2;

    // Iterate around the longitude axis at the given interval
    for (
      iLineOfLongitude = iMIN_LONGITUDE;
      iLineOfLongitude <= iMAX_LONGITUDE;
      iLineOfLongitude += iDEGREES_BETWEEN_GRID_LINES
    ) {
      // Convert the longitude value and move the pen to the start of the line
      iDegreesScreenX = this.degreesOfLongitudeToScreenX(iLineOfLongitude);

      //iDegreesScreenX = iRadius * (degToRad(iLineOfLongitude) - (degToRad(iLineOfLongitude) * iCentralMeridian));

      ctx.moveTo(iDegreesScreenX, this.iMAP_START_Y_POS);

      // Plot the line // Vertical Line
      ctx.lineTo(iDegreesScreenX, this.iMAP_START_Y_POS + this.iMAP_HEIGHT);

      // Put the label on the line
      ctx.fillText(
        iLineOfLongitude,
        iDegreesScreenX - 10,
        this.iCANVAS_START_Y_POS + 10
      );

      ctx.stroke();
      ctx.closePath();
    }
  }

  drawGraticule(ctx: any) {
    // Set distance between lines
    var iDEGREES_BETWEEN_LAT_GRID_LINES = 10,
      iDEGREES_BETWEEN_LON_GRID_LINES = 10;

    // Style
    ctx.lineWidth = 0.09;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillStyle = 'rgb(255,255,255)';

    // Font styling
    ctx.font = 'italic 10px sans-serif';
    ctx.textBaseline = 'top';

    this.drawLatitudeLines(ctx, iDEGREES_BETWEEN_LAT_GRID_LINES);
    this.drawLongitudeLines(ctx, iDEGREES_BETWEEN_LON_GRID_LINES);
  }

  drawLandMass(ctx: any) {
    var landMass = this.getMapData(),
      iFirstScreenX = 0,
      iFirstScreenY = 0,
      shape,
      iLat,
      iLon,
      bFirst = false,
      iShapeCounter,
      iPointCouner;

    // A lighter shade of green
    ctx.fillStyle = `silver`; //'rgb(0,27,0)';

    // Iterate around the shapes and draw
    for (
      iShapeCounter = 0;
      iShapeCounter < landMass.shapes.length;
      iShapeCounter++
    ) {
      shape = landMass.shapes[iShapeCounter];

      ctx.beginPath();

      // Draw each point with the shape
      for (iPointCouner = 0; iPointCouner < shape.length; iPointCouner++) {
        iLon = shape[iPointCouner].lat;
        iLat = shape[iPointCouner].lon;

        // Before plotting convert the lat/Lon to screen coordinates
        ctx.lineTo(
          this.degreesOfLongitudeToScreenX(iLat),
          this.degreesOfLatitudeToScreenY(iLon)
        );
      }

      // Fill the path green
      ctx.fill();
      ctx.stroke();
    }
  }

  plotPosition() {
    // Grab a handle to the canvas
    var canvas = this.shadowRoot?.getElementById('map') as HTMLCanvasElement;
    var ctx: any; //= canvas.getContext('2d');
    if (!canvas) return;
    // Canvas supported?
    if (canvas.getContext) {
      // Grab the context
      ctx = canvas.getContext('2d');
      //debugger;
      if (this.locations == undefined || this.locations.length == 0) return;

      ctx.setLineDash([]);

      this.draw_start(ctx, this.get_XPos(0), this.get_YPos(0));
      if (this.locations.length == 1) return;

      if (this.locations.length == 2) {
        this.draw_arrow(
          ctx,
          this.get_XPos(0),
          this.get_YPos(0),
          this.get_XPos(1),
          this.get_YPos(1)
        );
        this.draw_here(ctx, this.get_XPos(1), this.get_YPos(1));
        return;
      }

      for (let index = 1; index < this.locations.length - 1; index++) {
        this.draw_circle(
          ctx,
          this.get_XPos(index),
          this.get_YPos(index),
          (index + 1).toString()
        );
        this.draw_arrow(
          ctx,
          this.get_XPos(index - 1),
          this.get_YPos(index - 1),
          this.get_XPos(index),
          this.get_YPos(index)
        );
      }

      this.draw_here(
        ctx,
        this.get_XPos(this.locations.length - 1),
        this.get_YPos(this.locations.length - 1)
      );

      this.draw_arrow(
        ctx,
        this.get_XPos(this.locations.length - 2),
        this.get_YPos(this.locations.length - 2),
        this.get_XPos(this.locations.length - 1),
        this.get_YPos(this.locations.length - 1)
      );
    }
  }

  get_XPos(index: number) {
    var longitude: any = this.locations[index].longitude;
    return this.degreesOfLongitudeToScreenX(longitude);
  }
  get_YPos(index: number) {
    var latitude: any = this.locations[index].latitude;
    return this.degreesOfLatitudeToScreenY(latitude);
  }
  draw_here(ctx: any, x: any, y: any) {
    ctx.beginPath();

    var img = new Image();
    var data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXQAAAJSCAYAAADTfj7lAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAEwAAABMABwzFTkQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAQdEVYdFRpdGxlAG1hcCBtYXJrZXKpBYBMAAAgAElEQVR4nOzdd5xfVZ3/8deZVExIKKEEMCSgNDEosMqCBvgpIthlseGyupZ1167rru6qa3d37Q0biFIVF1FIICQhvZAEEtJ7Muk9mcwkmT6f3x/fb2KAlDnnnu/3lu/7OQ8elORz7weGec+Zc889x5kZIlnknKsDTgHOAAaX/3zGIX/fF6gr/9HjOX8+0l8/95+1ANvLf+w42p/NrLnC/8oiiTgFulSbc84BJ/P8gD7jOX+cDvRMqc3D2c9fA/5A2G8H1gOLgUVmtiG99qTWKdClopxzZwLDgZeW/3wJcB7QO82+KmgP5XAv/7GQUtBvTrUrqQkKdInCOdcPeAml0D40wE9Ks68M2c1fQ/7gH2a2NdWupFAU6BLEOTcEeDUwovzn8ynNS4ufnZRG8VOACcB0M2tJtyXJKwW6dItz7gL+Gt6vBs5Ot6PCagWepBTuE4Anzawt3ZYkLxTocljOuRcBNwJXUwrwU9LtqGY1A9P5a8DPNrP2dFuSrFKgCwDOuR7AVcAbgTcBF6TbkRzBPmAqMJFSwD9lZp2pdiSZoUCvYc65E4DXUwrxG9ADzDxqBEYBDwCPmVlryv1IihToNcY5Nxh4J/AW4FVka523JNMI/Bn4PTBOUzO1R4FeA5xz/YG3Ae8FXkPpDUkptl3AnyiF+0RNy9QGBXpBlefEr6MU4m8F+qXbkaRoK/B/wB+AqaYv+sJSoBeMc+4ySiH+buC0lNupqB70oI46XPnj0L/uzt8DNNPMfvbTSc0MYDdSmm//g5nNTLsZiUuBXgDlKZV/AP4FuCjldhLrQQ/605/jD/MxgAEH/7oPfaLds4029rGP/Yd8HO3vWyjEuz+rgNuAO8xsT9rNSHIK9Bxzzp0LfAx4PzAw5Xa6rT/9OY3TOJETDxvaL+AFabd4TF10sY997GAH29jGdrYf/HMOw34v8Dvgx2a2PO1mJJwCPYecc9cBn6D04k9mX7fvSU9OLX+cdshHHgI7iSaa2Fb+ODTo28j8C58GjAZ+BIzRXHv+KNBzorz51a3Ax4ELU27neXrQgzM5kyEMYTCDOY3TOImTDs5VC+xhz7NCfhOb2M72tNs6kiXAj4G7zGx/2s1I9yjQM845dyLwyfIfJ6TczkF96csLeSFDyh9nciY9tBrS2z72UX/Ixw52pN3Sc+0Gbgd+ZmZr025Gjk6BnlHOuZOBT1MakQ9IuR3605+hDOVszmYIQziVU9NuqZD2spd66lnDGuqpZxe70m7pgE5KLy39yMympN2MHJ4CPWOcc6cAnwU+CvRPs5fTOZ3zOZ/zOI8zOCPNVmpWI40HR+9rWEMDDWm3BPAU8B9mNjbtRuTZFOgZ4Zw7DfhX4J9J6SWgnvRkKEMPhviA9H8wkOfYwx6Ws5yFLGQd69JuZzzwBTOblXYjUqJAT5lz7iTgi8BHgOOqff8+9OFCLuR8zudczqUXvardggRqoolFLGIhC9nIxjRbeQj4TzNbkmYTokBPjXOuF6VplS8DJ1bz3nXU8WJezHCGcx7n0VP7c+VeAw0sKn9sJpXjSzuBu4H/MrPUf3SoVQr0FDjn3gR8l9JhyVXzQl7IcIbzEl7CcdX/YUCqZBe7WMhCFrGIbWyr9u1bgV8A3zSzzK7JLCoFehU554YD36e042FVnMzJDGc4L+WlnFjdHwQkA7az/WC472RnNW+9l9L/6981s6Zq3riWKdCroPzA8+vAB6jCm50Ox/mczyt4BcMYVunbSU5sZCOzmMVCFtJFV7VuuwP4FvBT7c9eeQr0CirPk38W+A/g+Erfry99uZRL+Rv+hhOy8w6SZMxe9jKb2TzN0+xjX7VuuxD4iJlNq9YNa5ECvUKcc1cAvwYurvS9TuVUXsErGM5wrVKRbuukkwUsYCYz2cKWatzSKH1NfN7MdlfjhrVGgR5ZeSvbb1LaBbGi0yvncz5XcAVDGVrJ20gNWMtaZjKTpSzFqHgmbAU+Y2b3VfpGtUaBHpFz7vWUnvCfXcn7XMAFXM3VnM7plbyN1KAGGpjNbOYwpxrbAI8F/tnMVlX6RrVCgR6Bc24Q8EPglkre5wIu4Bqu4bRiH0QkGdBOO3OZyxSmsJe9lbxVC/AN4H/10DQ5BXpCzrn3UNo/elCl7nEhF3I1VyvIperaaWcWs5jK1EqP2BcDHzKz6ZW8SdEp0AOVt7X9NXBTpe6hIJesaKGF6UznSZ6knYoNpDuBbwNfNbOOSt2kyBToAZxzI4B7gBdW4vpDGMLreT2DGVyJy4sE28c+JjOZp3m6kgdrPwncYmarK3WDolKge3DO9QT+i9K68ugrWE7kRK7jOi7M3oFEIs/SQAMTmch85ldqVUwT8FEzu7sSFy8qBXo3OeeGAvcBfxv72n3owwhG8EpeqVN/JFe2s53xjGcpSyt1i/sprYTZU6kbFIkCvRucc+8Gfg4MjHpdHJdxGddybeEPTpZi28hGxjKWtVTklLp64L16y/TYFOhH4Zw7jlKQ/0Psaw9jGK/n9TrKTQrlGZ5hDGNopjn2pTspLW/8uplVbPI+7xToR+CcO5vSxv0vj3ndvvTldbyOl8e9rEhm7Gc/YxjDPOZV4vKTgb/T1ryHp0A/DOfcNcAfiby2/EIu5EZupH+6R4WKVEU99YxkZCW27V0HvNXM5sa+cN4p0J/DOfdxSvs4RzvG53iO50Zu5AIuiHVJkVzopJOpTGUKU2Ivc9wP/KOZ/SHmRfNOgV7mnOtDaR+W98W87mVcxnVcRx/6xLysSK7sZCejGMUa1sS+9LeBL5pZ1TZ4zzIFOuCcOxP4E/CKWNc8gRN4K2/l7Mru0yWSK3OZy2hG00ZbzMuOAt5jZo0xL5pHNR/ozrkrgQch3taFF3Mxb+SNGpWLHMYudvEn/sRGNsa87FLgLWa2POZF86amA905dyPwfxDnxOTe9OZGbuQSLolxOZHC6qKLiUxkKlNjvmnaALzbzEbHumDe1GygO+feQWk/lihH/JzJmdzETTqIWcTDWtbyEA+xh2gvgnZR2jLgF7EumCc1GejOuQ8AvyLCfiwOx1VcxbVcS13lz38WKZwWWhjJSBaxKOZlv2hm34x5wTyouUB3zn2a0rLExPrTn5u4SUfAiUQwj3k8yqMxH5j+CPi01VDI1VSgO+e+Qmm3xMTO4izeyTv1kpBIRLvYxR/4A9vYFuuS9wLvq5X91Wsi0J1zjtKo/FMxrncpl3IjN2pnRJEKaKONh3go5g6OjwI3m9n+WBfMqsIHunOujtLJQv+Y9Fp11HEDN3A5lydvTESOaiITmcSkWJebDrzRzHbHumAWFTrQnXO9KP3IdXPSa/WjH+/gHQxhSPLGRKRblrCEh3go1rF3C4DrzWxzjItlUWEDvbz17YPADUmvNZjBvIt3MYAByRsTES/b2Mb93E8DDTEutwZ4bVGPtytkoDvnBgCPACOSXusiLuJtvI2e8fbqEhFPzTTzAA9QT32My60FRpjZuhgXy5LCBbpz7mTgceCypNd6OS/nTbwJh0vemIgk0kUXoxnNbGbHuNxKSqFeqOmXQgW6c+4MYCxwUdJrXcEVXM/1yZsSkaimMIXxjI9xqSXA1UU6LKMwgV4+xPkJ4Jyk17qGa7iaq5NeRkQqZA5zGMnIGPvAzAOuLcrql0IEunPuBErLki5Meq3ruZ4ruCJ5UyJSUUtYwoM8GOPgjNmUHpTmfvvd3Ae6c643pTnzaxJdB8ebeTMv42VR+hKRyqunnvu5P8Z2AVOB15vZvghtpaYIgX4X8PdJrtGDHrydt3NR8ql3EamyzWzmXu5lH4mz+AlKLx+1RGgrFbneHtA591UShnkvevEu3qUwF8mpwQzmH/lHTuCEpJd6DXB/+e3yXMrtCN059w/Ab5Ncow99eA/v0dufIgXQRBN3cRc72JH0Ut83s8/G6KnachnozrnXAI+R4HCKF/AC3st7GczgeI2JSKqaaOJO7mQ3iRet/HMeD8nIXaA7514CTAMGhl7jeI7nVm5lEIPiNSYimbCHPdzJnUlPQeqkNJ+eq+PschXozrnTgZkQPkdyIidyK7fGmG8TkYzaxS5+y29poinJZZqAq8xsQaS2Ki43k//OuX7ASBKE+UAGxnp4IiIZdhIncSu38gJekOQyxwMjywPJXMhFoDvnegD3k2B/lr705RZu0QlDIjViEIO4lVs5juOSXGYI8IhzLtF3hmrJRaBTOhvwTaHFPejBO3knp3BKxJZEJOtO4zTey3vpQ58kl7kcuDcPyxkz36Bz7jPAR5Nc4828WQc5i9SoMziDW7gl6RbYbwW+Hqmlisn0Q1Hn3NuBP5LgG8+1XMuI5Nuii0jOLWUpD/BAkg29DHiTmY2K2FZUmR2hO+deCdxDgh5fxssU5iICwAVcwGt5bZJLOOAu59zZkVqKLpOB7pwbCDwA4U8zzuEc3hQ+7S4iBXQlV3JZsrNvTgIeKG8KmDmZDHTgNhIsTzyVU3kH76Aus/96IpKWG7mRc5Idm/AK4HuR2okqc4nnnHsP8J7Q+uM5nlu4JelTbREpqDrqeAfvSLrq7WPOuXfG6imWTD0ULc9NzSPwtf7e9Ob9vJ/Tyc17ACKSkgYauJ3bk2y7uxe43MyWRWwrkcyM0MtrPO8mMMzrqONmblaYi0i3nMAJvIt3JVnO2B/4vyy9dJSZQAc+D7w6tPgNvIEX8aKI7YhI0Z3FWUkXT1wM/CxSO4llItCdc5cDXwmtfxWv4lIujdeQiNSM4QxPuvLlfc65N8bqJ4nUA73848q9BO5tfhEX8RpeE7cpEakpN3BD0rMRfu2cOzlWP6FSD3TgB8B5IYUDGcibeXPkdkSk1vSgBzdzM33pG3qJ0yktt05VqoHunHsL8OGgWhxv5+1anigiUZzIibyVtya5xDvSXsqYWqCX9xi+PbT+Kq7SWaAiEtX5nM+VXJnkErc551I71zKVQHfOOeBOCDsDbjCDuZZr4zYlIgK8htckGSyeBPw6Yjte0hqhfxx4fUhhL3pxEzfptX4RqYg66vg7/o5+9Au9xBuccx+I2VN3VT0Vy4c8/09o/et4HSeT+sNkESmw4zk+6Xz6D9LYlbGqge6c6wPcB2GPkl/Mi7mcy+M2JSJyGC/iRUnebzkeuCNiO91S7RH654DhIYX96MdbeEvkdkREjux6rk9yqPxrnHPvjtnPsVQt0J1zQ4AvhNa/mTcnmdMSEfHWm95Jp16+55w7PlY/x1LNEfr3gaBNbC7ncs4Le/dIRCSRszmbK7gitHwwCbY18VWVQHfOvRa4KaT2ZE7mdbwuckciIt33Gl7DoLBV1gCfKC8GqbiKB7pzrhfwk5DaOuq4iZvoFbbNi4hIFD3pydt4W+hy6Z5UaUfGaozQPwlcEFJ4Ldcm3TBHRCSKMziDV/Gq0PKry6exVVRFA738CuyXQ2qHMISruCpyRyIi4a7m6iTvwXy30g9IKz1C/w6l9ZheetCDt/AWHK4CLYmIhKmjjhu5MbR8MPDViO08T8UC3Tn3auCWkNoruZKTOClyRyIiyZ3DOVzERaHlH3fOXRyzn0NVJNCdcz2An4bUDmAArw4/iU5EpOKu5/rQxRo9KZ0BURGVGqG/h8A3QhP8hxIRqYoBDOBqrg4tf61z7pqI7RwUPdCdcz2B/wqpTfijjIhI1fwtf5tkbfo3YvZyQCVG6P8AnOvfSB03cEMF2hERiS/hA9KrnHPRAy9qoDvnegNfCqm9giuSfLcTEam6YQzjYoKfcX6jfNhPNLFH6B8AvPcA7k//JPNRIiKpeR2voze9Q0ovBd4Ws5dogV7e6/w/Q2qv47rQ/yAiIqk6nuMZwYjQ8q8556LlcMwR+j8BZ/oWncZpDA9bECMikgmv5JX0p39I6UuAaHumRwl059wLCNzrXIc9i0je9aRnkvdnvlJeHZhYrBH6vwCn+xYNZjDnc36kFkRE0nMZlzGQgSGlLwLeF6OHxIHunOsP/HtIrUbnIlIUPeiRZHHHl8pbjScSY4T+AfBfb3gWZ/FiXhzh9iIi2XAJl4TuQzUEuDnp/RMFenkN5cdCajU6F5GiqaOOa7gmtPxTye+fzI2U5n+8DGEI53BOwluLiGTPxVzMKZwSUvo3zrkrk9w7aaB/PKRIo3MRKSqHS5JxiUbpwYHunDsf/E9vHsYwhjI09LYiIpl3IReGHp/5dufckND7Jhmhfwz8jxTSXuciUgsCs64Hgc8lITDQnXMDCFg3eSqnMoxhIbcUEcmVC7iAEzghpPRDzrl+IYWhI/T3g/97rq/klYG3ExHJF4cLzbwTKG1D7s070EOXKh7HcdqzRURqyqVcSh/6hJR+ImRr3ZAR+g0ELFW8lEvpSZTtCkREcqE3vXk5Lw8pPR/8T/wJCXTv0bnD8Tf8TcCtRETy7ZW8Eue/fgTgQ74FXoHunDudgKWKF3BB6KY1IiK5dgIncAEXhJTe4JzzeqrqO0J/B6VlNV70MFREatkVXBFS1gfP/V18A/09nr+f0zmds/1PpRMRKYwhDOEMzggpvcXnN3c70J1z54L/UFujcxGR4FH6COfcC7v7m31G6N7HJPWhT5ITsUVECuNCLgxZwujwmBmpaKBfyIVaqigiQumYugu5MKT0vd39jd0KdOfcJcBFvl28lJf6loiIFFZgJl7snOvWW5ndHaF7PwztT3/t2yIicohhDKO//64p0M1R+jEDvfz66bt87/4SXhK6mF5EpJAcLvS54rudc8fM6+6M0K+idN6dF023iIg8X+CeVmfBsU+g7k6ge0+3nMiJnMmZvmUiIoU3mMGczMkhpcdck96dJShv9r2rRueShv3sZ8chH0000facj1Za6aCDXvSiN73pQx96H/IxkIEMKn+czMn0pW/a/1pSQC/lpUxkom/ZMTfrOmqgO+cuAv+htgJdKm0f+6gvf2xlKzvYQTPN3a7v7u/tRz8GMYjBDGYoQzmbsxXykthwhocE+hnOuZea2YIj/YZjjdC9N+I6ndMZxCDfMpGjaqGFNayhnnrWsIbtbK/KffeVP9aylid5EofjdE4/eDbuUIbSi15V6UWK48C09EY2+pZeD1Qv0PVmqMTSRRcrWME85rGc5XTSmXZLGMbm8sd0ptOLXlzERVzCJQxlqFZ2SbddyIWhgf7dI/2iM7PD/4JzfYBdwAt87vZRPqoRuiSyiU3MYx4LWch+9qfdTrcNYADDGc4lXKKvATmmrWzlF/zCt6wVOMnMDvuFcbQR+lV4hvkABuh/ZAm2jGVMYUrIqCUTGmlkavnjHM5hBCO006gc0WmcRj/6sY99PmV9gGuARw/3i0cLdO/plnM4x7dEapxhLGYxU5jCVram3U40q8sfQxjCCEZwLuem3ZJk0Lmcy3zm+5ZdTzUCXf/Tio/5zGcyk9nJzrRbqZh1rOMe7uEMzuAaruHFvDjtliRDXsSLQgP9sA4b6M65U4CX+d5FI3Tpjq1sZRSjWM/6tFupmk1s4j7u4zzO4wZu4AS8ThaTggrMzPOdc2eb2drn/sKRRujXgd/j+tM5nRf4TblLjWmjjQlMYBaz6KIr7XZSsZzlrGY1IxjBlVxJD/8THaVA+tGPwQxmM5t9S68HfvXcf3ikV/+v8726plvkaBazmJ/yU57kyZoN8wM66GA84/k5P2cNa9JuR1IWmJ2HnXY5UqBr/lyiaKedP/Nn/sgfaaIp7XYyZSc7uYu7GMe4mv8mV8sCs/Paw/3D5wW6c+4c8DvNtCc9GeK/IaMU3Ha282t+zTzmpd1Kpk1jGr/ltzTSmHYrkoIhDKE3vX3LTixn9bMcboR+qe+Vz+ZszQXKszzDM/yaX1ftFf28W896fsEvWMGKtFuRKqujjqEMDSm9/PnXer7LfK+q6RY5oIsu/lL+aKc97XZypZlm7uM+xjM+7VakygIz9HmBfrhVLs/7TccS+N1FCqaddh7gAVayMu1Wcm0KU2iiiTfxJuq8znGXvDqLs0LKuhXoXlMuPejBqZwa0owUSDPN3Mu9uX1tP2ue4Rn2s5+buZme3Tq2QPLsNE6jjjrfh+OXOuecHbIh17O+/TvnhgEn+VzxVE7V/HmN28MefsNvFOaRLWc5d3EXLbSk3YpUWODAeCA8+9Xj5/485z1/PpjBviVSILvYxR3cwQ52pN1KIa1nPb/hN7nadVLCnOG3uPCAZ027KNAl2F72cjd3a315hW1nO/dyL220pd2KVFBglh410L0fiCrQa1MrrdzDPTTQkHYrNWETm/gDf8jEIR9SGZUYoXs9EK2jjtM4LaQJybEOOrif+wu13W0erGY1D/EQxuEPpZF8O/Bg1NPLnXMHiw7+RcgD0UEM0hP4GmMYD/Iga3neRm9SBYtYxGhGp92GVEDgg9H+wAUH/ubQbweaP5djmsAElrI07TZq2ixmMYc5abchFRCYqQez+9BAf7nvVQLnfCSnVrGKKUxJuw0BHuMxTXkVUGCmnn/gLw4NdO93TzVCrx1NNPEn/pR2G1LWQQd/5I9a+VIwgZk67MBfHBroQ32vogeiteHAvLnWQmfLTnYykpFptyERBWZq8kDvR7+QLR8lhyYyUQ9BM2oBC5jL3LTbkEh60pPjOd637NmB7pw7Dvy+NehMxNqwla2aN8+4x3mcvexNuw2JJCBbTytn+MER+tlVuKnk0ChGad1zxrXSyuM8nnYbEsmJnOhb4ijPsBwI9KFVuKnkzFzmsp71abch3bCQhTqftCACB8tDQSN0OYJmmhnHuLTbEA+jGKWtAQogMFuHQYIRugK92MYxTqtacmYnO5nO9LTbkIQCZz8U6HJ4O9ihlRM5NZWpNNOcdhuSgEboEtVUpupBaE610cZMZqbdhiQwkIEhm3SFB3p/+uuUooJqoIEFLEi7DUlgJjNppTXtNiSQwzGAAb5lpUB3zvXFcw26VrgU11Sm+p5rKBnTQguzmZ12G5JAwAzIic65gXWUVri4Ct9McqCJJp7hmbTbkAhmMIN22tNuQwIFDprPqANO8a1SoBfTDGZo2VtB7Ge/HmznWMDr/wAD6sC/sh/9Qm4mGdZFF/OZn3YbEpF+2sqvPvQJKRtYBwys0s0kw1aykn3sS7sNiWgzm9nBjrTbkAB96RtSNqAO/B+nKtCLZx7z0m5BKkCf13xKMkJXoNe4FlpYxrK025AK0BLUfAocoSvQpXTwsB6GFtMe9mgv+xwKzNgBQXPogd89JKMWsSjtFqSC9PnNH025SJBOOrVFbsGtZnXaLYgnTblIkPWsp4OOtNuQCtrJTppoSrsN8VC1EbrD0YteITeTDKqnPu0WpAp0+EW+9KY3zu8FfgiZQ9fovFj0hV4b9HnOn4Cs9R+h64FocXTQwUY2pt2GVIHm0fMnIGv9A10j9OLYyEYtV6wRjTSyhz1ptyEeArLW/01RBXpx6LXw2qLPd76EBrrX0Rh6IFoc+gKvLfp8F15nHfhtmqwf0YtDX+C1RZ/vfAnI2nYFeg3TF3ht0ec7XwKytq0OaKvwTSSDOujQQ7Ias5OdabcgHkIDXSP0GrSb3RiWdhtSRU006Vi6HAk421eBXqtaaEm7BUmBPu/5oTl06bZWWtNuQVKgz3t+aA5duq3N79MuBaHPe35oykW6TV/YtUmf9/zQlIt0m76wa5M+7/mhVS7SbZpLrU36vOdH6JSL17dsHYZQDAF7LUsB6POeH1WZcrHyh+Rbb3qn3YKkQJ/3fAgYnUPIlAtolF4E+sKuTfq850Pg1Fh7HbDPt2ove0NuJhmiL+zapM97PjTSGFK2qw7YVKWbSYZoX/vapM97PgQe6r0hKNB1gnj+aaRWm/R5z4fAQfPGOvA/VFKBnn86G7Y26fOeD0kCXSP0GnQSJ2kJW405nuN14lhOJJly0Qi9BvWgBydwQtptSBUNYlDaLUg3VXWEroeixaAv8Nqiz3d+BGRsk5k11plZM7Dbq1Ij9ELQF3ht0ec7PwICfSNAXflvvEbpCvRi0Bd4bdHnOx866Ag5iGQD/DXQvebRA28oGaMv8Nqiz3c+hM6fQ+AIHTRKL4IzOIMe9Ei7DamCgQxkAAPSbkO6ITDQw0fooEAvgp705CzOSrsNqYJzOCftFqSbArM12Qh9t99zVMmoYQxLuwWpAn2e8yMwW58V6Bt8q7ewJeSmkjFDGZp2C1IFCvT82MrWkLJnBfr8Kt1UMuYszqInPdNuQypoEIPoT/+025BuChgsG7AMyoFuZvXAHp8rKNCLoQc9GMKQtNuQCtL8eX600cYudvmWrTKzvfDXETrAvCrcWDLoYi5OuwWpoJfwkrRbkG7axraQsmcO/EXd4f5hd2mUXgwXcZGmXQrqBE7QT2A5Evhs8uBgPHiEnuDmkjF96MMFXJB2G1IBwxmedgviITBTDztCV6DXsEu4JO0WpAIU6PkSM9AXgt/pz5pyKY5zOVcrIQrmTM7kZE5Ouw3pJsNC5tB3mdnBZecHA93MWikvfemuPezRni4F4XAapRfMy3hZ2i2Ih13sop1237JnPfusO9ovdoemXYrjCq7Qw9GC6E9/BXrOJH0gCs8PdO959M1sDmlCMqg//Xk5L0+7DYngb/lbfXPOmaTz5xBhhL6GNSFNSEZdxVXUPe9/C8mT4ziOy7k87TbE0wb/HVjgGIHuPUJfy1q66AppRDJoIAM1l55zV3AFvemddhvioYMO1rPet6wNWHLoP3hWoJvZNvCbQ2mjLfQ7i2TUq3gVDpd2GxKgD314Ba9Iuw3xtI51dNLpW7bYzJ71FPVwP1tP9L3qKlb5lkiGncRJ+pE9p0Ywgr70TbsN8bSa1SFl0577Dw4X6OOq1Ixk2P/j/9GPfmm3IR5O4RSu4Iq025AAgRn6xHP/weECfazvVTeykVZaQxqSjOpLX17H69JuQzy8gTfogXYONdMcssKli8PMpjzvs29m6/F8wcgwrXYpoOEM52zOTrsN6YZLuESfq5yqpx7DfMvmmtnzjhofpYcAACAASURBVDY60rdzTbsIoFFfHvSlL9dxXdptSKBY0y1w5ED3nnZRoBfTKZzC1VyddhtyFDdwg5535Fjg7IZXoE/Ac6Ounexkj9+hR5ITr+bVOpMyo17Gy7SjYo410shOdvqWtQFTD/cLhw10M2sEZvveRaP0YnI4buIm7caYMadwCjdyY9ptSAKBo/MZZrb/cL9wtMlR72mX5Sz3LZGc6Ec/3s7b9cJRRvSiFzdzM73olXYrksBKVoaUHXa6BSIH+gpWaPligQ1jmObTM+INvIFTOCXtNiSBdtpZ5reg8ICgQJ8J7PW5SyedLHn21gJSMCMYoUOHU3YlV2q/nQJYwpKQ/c+bgFlH+sUjBnp5j4AJvndbyELfEskRh+NtvE0PSVNyCZdoiWJBLGBBSNlkMzvigpVjLTD+k+/dVrOafezzLZMc6UEP3sW7GMzgtFupKS/mxbyZN6fdhkSwj32he2A9dLRfPFagPwR+k+KGsYhFPiWSQ73pzS3cwkmclHYrNeEszuJmbtZLXgWxkIUhb4e2Ag8e7Tcc9f8OM9sDPOp7V0271IZ+9OPv+XsGMjDtVgrtdE7nPbxHK1oKJHC65VEzazjab+jOt/v7fe+6nvV6yahGnMAJfIAPcCqnpt1KIQ1lKO/jfRzHcWm3IpHsYhcb2RhSeu+xfkN3An0knqtdQKP0WnI8x/N+3s8QhqTdSqFcyIW8l/fShz5ptyIRzWd+SNkeSll8VMcMdDNrBv7se/fAHykkp/rSl7/n7zmf89NupRAu53Ju5mZ60CPtViSywGx80MyO+Tyzu09YvKddtrKVHezwLZMc60lP3sk7ddpRAg7HtVzLG3iD3sotoHWsYxe7QkqPOd0C3Q/0seC/g8wc5viWSM45HG/gDdzETTqo2NOBh8wjGJF2K1IhT/JkSNkmunk0aLcCvfyS0f/5djGXuSFvQkkBXMzFfJgPcxqnpd1KLgxlKB/hI3phq8B2s5ulLA0p/b2ZdXXnN/osavWedmmhRXPpNexkTuaDfJDLuCztVjLL4biaq7mVW7WbZcHNZGbI2nPo5nQL+AX6FPBfazPryNsOSA3oSU/eyBt5N+/WevXnOJVTeT/v5xqu0Xx5wbXSylzmhpQuNbNuz1337O5vNLMu59zdwOd9utnKVtaznhfyQp8yKZjzOI9hDGMyk5nBDDrpTLul1PSmN9dwDa/klXrzs0bMYQ5ttIWU3uHzm51Z938EcM4NAVaD31qqi7mYm7jJp0QKbAc7eJRHa/Jg8Yu4iNfzeo7n+LRbkSoxjB/xo5CXLfcCLzzW26GH8hoemNk6urG4/bkWs5i9/u8mSUENYhC3cis3c3PNvGE6hCEH/50V5rVlMYtD35y/0yfMwXOEDuCcey0Bh19cwzU6HEEOaxnLmMxkNrEp7VaiO4dzGMEIzubstFuRlNzBHWxgg29ZF3CemXltydjtOfRDPAEsA79XAp/maV7NqzVnKM9zfvljFauYwhTWsjbtlhI7j/MYwQjO5My0W5EUbSh/BHjYN8whINDNzJxztwE/8qlrooklLNFpN3JE55Y/trGNecxjPvNzNVV3IidyCZcwnOGcyIlptyMZMJ3poaU/CCnynnIBcM4NoLSE0Wvh7GAG82E+7H0/qU2GsZrVzGMeS1mayZfU+tKXl/ASLuESreSSZ9nOdm7jtpDSp80saP+MkCkXzKzROXcP8BGfus1sZjnLOY/zQm4rNcbhDo7a22hjLWupp541rGELW0Jf0kikjjrO5EyGMYyhDGUIQ7SBlhzWJCaFlgaNziFwhA7gnLsY/F8DPZMz+SAfDLqnyAEttBwM+AMbwTXRFP0+AxnIIAYxmMEHA1wHTcix7GAHt3FbyKBjIzCsvN2Kt6AROoCZLXTOTQK/pSsb2cgqVnEu54beWoS+9D34MPWANtrYcchHE020PeejlVY66KAXvehNb/rQh96HfBwI8EEM4mROpmf4l4jUsMlMDv0J8qehYQ4JAv3AzfEMdCj9KKJAl9h605szyh8iadnJztADfvYCv0xy76RrCB8C/6Or17OeeuoT3lpEJHumMCV0dP4zM9ud5N6JAt3MOoFvhdQmeGAgIpJJu9gVesTcPuB7Se8f4y2fu8F/uF1PPetYF+H2IiLZkGB0/nMz2570/okDvTyB/+2QWo3SRaQoGmgIHZ03A9+N0UOs9/B/C6z3LVrNatb7l4mIZM4UptBFtw4Weq5fmNnWGD1ECXQzawP+O6R2DGNitCAikpo97OEZngkpbQH+N1YfMXfKugP8t8vbwAYWszhiGyIi1ZVgdP4rM9sSq49ogW5mrcD/hNSOY1zofwwRkVQ10hg6Og/OzCOJvZftrwDv7za72c1sZkduRUSk8qYyNfRIxdvNLOohAFED3cxagO+E1E5iEi20xGxHRKSimmhiDt0+w/lQwc8dj6YSp038EvBeT9lMM1OYUoF2REQqYxrTQkfnvzGzoJMvjiZ6oJvZPuCrIbUzmRl69p6ISFXtZS9P83RIafC7O8dSqfPgfgks9y3qpJMneKIC7YiIxDWNaXTQEVL6WzOryGvyFQl0M+sAPh9Su4AFbGZz5I5EROJJODoP2v+qOyp2YrOZPQRMDakdx7jI3YiIxDOJSaFHIt5lZvWR2zmoYoFe9rmQotWsZgUrYvciIpJYAw2hK1s6qODoHCoc6Gb2JPDHkNqxjE3lzEgRkaOZyMTQFyHvMbPVsfs5VKVH6ABfAP+fTbazPfS7oIhIRexkZ+iOip3ANyO38zwVD3QzWwXcFlI7gQm00Ra5IxGRMBOYEDpzcJ+ZrYzdz3NVY4QO8HXwX2C+j31MDXuuKiIS1Va2sohFIaWdwDcit3NYVQl0M9tJKdS9zWAGjTRG7khExM8EJoSW3m1m3u/lhKjWCB3gJ4D3A4EOOvSykYikaiMbWcaykNJ2At+cD1G1QC8fghH0stF85utlIxFJzXjGh5beXsl1589VzRE6ZvZHYEZIrU42EpE0rGUtq/0nF6B0VmhV5s4PqGqgl30mpKie+tAfeUREgiUYnd8We7/zY6l6oJdfNnogpHYsY3WykYhUzUpWso6gfbT2UoH9zo8ljRE6lObSvReY72QnT/FUBdoREXm+BCtbfmhmO2L20h2pBLqZraG06sXbJCbRSmvkjkREnm0pS9nkf+49wG7gu5Hb6Za0RuhQeliwy7doP/t1spGIVJRhSUbn3zGzVE7qSS3QzawB+FpI7ZM8SQMNkTsSESlZyEK2sS2kdBvw48jtdFuaI3Qo7fHivU+uTjYSkUrpoouJTAwt/1b5GM5UpBroZtYO/HtI7UIWspGNkTsSkVo3j3ns8p8NBtgA/CJyO17SHqEfONkoaFL8cR6P3I2I1LJOOpnEpNDyr5tZqis2Ug/0ss+C/56U61nPQhZWoB0RqUUzmMEe/41hAVYBv4ncjrdMBLqZzQZ+H1I7lrGhZ/uJiBzURBOTmRxa/hUz64jZT4hMBHrZF8B/gXkjjdozXUQSSzA4XAzcF7mdIJkJdDNbC/wwpHY607WMUUSCrWMdC1gQWv4lM8vEniSZCfSybwPer8t20KHdGEUkiGE8xmOh5XOAhyK2k0imAr38dtVXQmqXsIQ1rInbkIgU3hzmsIUtoeX/aWZBh4xWQqYCveyXEHZw32hGhx7gKiI1qIWWJNvjjjGz0TH7SSpzgV5+UvzJkNptbNNujCLSbROYwH72h5R2AJ+K3E5imQt0ADN7AvhzSO0EJtBMc+SORKRotrGN2cwOLf+JmS2J2U8MmQz0ss8SsIyxmeYku6SJSI14jMdCp2i3UcWDn31kNtDNbDXw/ZDap3gqdKc0EakBi1lMPfWh5f+R1va4x5LZQC/7FvjvMJ9wGZKIFFjCZc5PAXdGbCeqTAe6me2ldFydt3rqWULmprhEJGVTmRq6X4sBn8jKS0SHk+lAL7sHeDKkcAxj6CD17RVEJCMaaGAa00LL7zGzGTH7iS3zgV5etP8JAnZjbKCB6UyP35SI5FKCQd5eAs9uqKbMBzoc3I3xdyG1U5lKI42ROxKRvFnDmiTTsN8ws80x+6mEXAR62ReAJt+idtoZy9gKtCMiedFFV5KFEiuBH0Rsp2JyE+hmtgX4RkjtQhayjnWROxKRvJjNbLazPbT802bWFrOfSslNoJf9kNJ3S2+P8ihdZPbhtIhUSCONSfZreczMRsbsp5JyFejl75KfCandylZmkOkH1CJSAaMYRRtBA+x2Mrhfy9HkKtABzOwRCHsrYCITQ0/zFpEcWshClrM8tPxHZhZcnIbcBXrZp8B/7VEHHYwkNz89iUgCzTQzmuDdbbcAX4vYTlXkMtDLu5z9LKR2DWuYy9zIHYlI1jzO4+xjX2j5583Me1Vd2nIZ6GVfIeC4Oii9XJDgEy0iGbeKVcxjXmj5TOCuiO1UTW4D3cwagC+G1LbQos27RAqqnfYkU6udwMeydKycj9wGetmvIOzd/kUsSvKwREQyajzjaaAhtPyHZpbbY89yHejl76IfhLA1SQmWM4lIBm1kIzOZGVq+GvhyxHaqLteBDgcfkH4rpLaRRp7gicgdiUgauujiYR5OclD8h80s6IDRrMh9oJd9G1gcUjib2WxgQ+R2RKTapjI1yUlld5bPMs61QgR6+Q3SDxGwxa5hPMzDdNIZvzERqYod7GAyk0PLt1I6wzj3ChHoAGY2Hfh5SO12tjOVqZE7EpFqSTgo+7iZ7Y7ZT1oKE+hln4ew+ZMpTGFH2LJ2EUnRbGaznvWh5X8xsz/G7CdNhQr08ptdHw2p7aSTR3gkckciUkmNNDKOcaHle4B/idhO6goV6ABm9jAQ9B13Het4itwuQRWpOQmXHv+7mW2K2U/aChfoZZ8AgubExjGOJv+DkUSkyhLupDiZ0ouJhVLIQC+fbvS5kNpWWhnFqMgdiUhMCXdSbAE+lNfX+4+mkIEOYGZ3ABNDapexLMlhsiJSYQl3Uvxa3vY5767CBnrZhyl9N/b2KI/SElYqIhWUcCfFZ4DvRGwnUwod6Ga2gsBN6veyl7GMjdyRiCQRYSfFD5qZ9+E4eVHoQC/7DoR9O5/DHNayNnI7IhIq4U6KPzCzp2P2kzWFD/Tyd+MPQdhrZI/wCB3+p92JSGQJd1JcRc53UuyOwgc6gJnNBn4cUruTnUn2iBCRCCLtpNgcs6csqolAL/sSUB9SOI1pbGVr3G5EpNsS7qT4GzMbH7OfrKqZQDezfcBHQmojjA5EJFDCnRS3AP8asZ1Mq5lABzCzx4F7Qmo3sSnJ/J2IBEq4k+LHirKTYnfUVKCXfRrCtlUcz3h2h+0oICIBEu6k+GczezBmP1lXc4FuZjsohbq3dtp5mIcjdyQihxNhJ8WgnVfzrOYCHcDM7gEeD6mtp56nKfRSVpFMSLiT4ueKtpNid9RkoJd9BMI2gxjLWBppjNyOiByQcCfFScDtEdvJjZoNdDOrJ/BFA+3IKFI52kkxXM0GetmPIOxEi+UsZwELIrcjIgl3UvxKeQ+nmlTTgW5mncAHIezd/sd4jP3sj9uUSA1LuJPiXOB7EdvJnZoOdAAzmwd8N6S2mWYe5dHIHYnUJu2kmFzNB3rZV4FlIYWLWMSysFIROUTCnRS/Z2ZzYvaTRwp0wMxagA9A2Lv9IxmpwzBEEljP+iRvYq8EvhKvm/xSoJeZ2TTgZyG1e9nLGMZE7kikNnTSqZ0UI1GgP9sXIOxEi7nMZTWrI7cjUnwTmciOsN04AG43swkx+8kzBfohzGwvpcMwgjzCI7TTHrEjkWLbwhamMz20fDPwuYjt5J4C/TnMbCxwZ0htAw08wROROxIppi66+At/oYuu0Et8zMyCn6IWkQL98D5D6bu/t1nMSrI7nEjNmMY0trAltPxPZvanmP0UgQL9MMrf9f8lqBZLun+zSOHtYAeTmBRavgv4WMR2CkOBfgRm9mfggZDaHexgIhPjNiRSEIbxF/6SZNDzCTML+gm66BToR/dxYGdI4XSmJ/lxUqSwZjGLDWwILR9lZvfG7KdIFOhHYWbbgE+F1EZ44CNSOAkXDjQSeC5wrVCgH0P5MIygDVu2sIVpTIvckUh+PczDSZb2/puZBQ/ta4ECvXv+CcJOtJjEpCQvTYgUxlzmsoY1oeWTgF9FbKeQFOjdUB4V/FtIbSed/IW/JHmtWST3mmji8bBTHwGaKe2kqC+iY1Cgd9+vIGzpygY2MItZcbsRyZFRjKKV1tDyL5vZypj9FJUCvZvKo4MPUhoteHuCJ5JsDSqSWwtZmGSL6dnADyK2U2gKdA9mtgr4UkhtO+08zMOROxLJtv3s5zEeCy1vBz5QPllMukGB7u8HEDZ/soY1zKHm9+CXGpLwmMZvm5kO7vWgQPdkZl3APwJtIfVjGMNe9sZtSiSDlrOchSwMLV8EfDNiOzVBgR7AzIL/Z2ulVeeQSuG10prkfNAuSlMtQYOmWqZAD/dtIOjHwSUs0TmkUmhjGEMTTaHlPzSz4PPoapkCPZCZtVOaegl6YPMoj9IWNmsjkmkJnxUFLzwQBXoiZvYU8L2Q2kYaGce4yB2JpKuddh7hkdByAz5kZsFPUWudAj25/wJWhBQ+xVNJdp0TyZzxjGc3u0PLdT5oQgr0hMysBfgA+L/bf+AwDO3IKEWwgQ3MJHjqeyM6HzQxBXoEZjYFuC2kdjvbmcrUyB2JVFeEPYv+2cz2xOypFinQ4/k8hB0mOpnJ7Aw7R0MkEyYzOcmuovebWfDEu/yVAj0SM9tL4DmknXQmeZAkkqptbEvyU+YO4JMR26lpCvSIzGwk8IeQ2rWs1bYAkksjGZnkOdAnzGx7zH5qmQI9vk9C2GP+sYzVtgCSK3OYw/qwmUaAkWZ2f8x+ap0CPTIz2wr8a0htCy1JdqYTqar97GcsY0PLdT5oBSjQK8DMfgMEraddzGKWszxyRyLxPc7jtNASWv45M9sYsx9RoFfSP0HY/+2jGKVtASTT1rCG+cwPLZ8A/DpiO1KmQK8QM1sBfC2ktpFGnuCJyB2JxNFJJ6MYFVreTOn1fp0PWgEK9Mr6DoQNY2Yzm43oJ1LJnqlMTfLexJfKJ39JBSjQK8jMOoAPgf+aLm0LIFm0k51MYUpo+TPADyO2I8+hQK8wM5sF/CSkdhvbmMa0yB2JhBvFKDrDdozuAj6i80ErS4FeHV8E1oUUTmYyu9gVuR0Rf/OZzxrWhJb/QodWVJ4CvQrK2wL8c0htBx3aFkBS10ILYxgTWr4F+I+I7cgRKNCrxMweBX4fUltPPXOZG7kjke4by1j2sS+0/FPaSbE6FOjV9UkImz8Zw5gkX1AiwdazPsk+Q6PNLGh/I/GnQK8iM9uGtgWQHOmii5GMDC1vBj4asR05BgV6lZnZncD4kNpFLGJF2Gl3IkFmMINtbAst/7qZrY7ZjxydAj0d/0Rp9OJN2wJItTTQwCQmhZYvBr4bsR3pBgV6CsxsJfDVkNo97GF82ABfxMujPEo77SGlBvyTmQUVSzgFenq+B8wLKZzFLG0LIBW1mMVJpvd+Y2Y6KDcFCvSUlLcF+CD4v3ZnGI/yaJIDeUWOqJVWRjM6tHw78G8R2xEPCvQUmdlTwI9DajexSWvTpSLGM54mmkLL/9XM9GpzShTo6fsSsDak8AmeSHLAgMjzbGITs5kdWj7BzO6K2Y/4UaCnzMz2EXgU13726wGpRGMYIxkZOpXXSuD2FhKPAj0DzGw0cF9I7VM8xRa2RO5IatEsZrGZzaHl/21my2L2I/4U6NnxKfA/NeDAA1KRJJpoSvLT3grg2xHbkUAK9Iwws+3AF0Jq17M+yfmOIjzGY0leWPuImbXG7EfCKNCz5Q7g6ZDCsYylFX1Nib/lLGcJS0LL7zEzPcjJCAV6hphZF6XNjLyfSu1lLxOZGL0nKbZ22pNM2e0GPhuxHUlIgZ4x5VNdfhtSO4tZbGd73Iak0CYzmT0Eb1X+7+UdRCUjFOjZ9Hmgwbeoiy5tsSvd1kADM5gRWj4NuD1iOxKBAj2DyqOeL4fUrmENi1gUuSMpojGMCT3wuZ3S5lvaeyJjFOjZdRuELV0Zw5jQXfKkRtRTn+RB6PfMTKOGDFKgZ5SZdQIfD6ltpJHJTI7ckRSFYUk231oDfC1iOxKRAj3DzGwygW+QzmAGu8KOL5WCm8MctrI1tPyjZhZ0OItUngI9+z4H7PUt6qRTD0jleVpoSfJG6J/NTP9TZZgCPePMbBOBP+KuZCXL0PYa8leTmMR+9oeUthJ4wLlUjwI9H34ILA0pHM1oOuiI3I7k0U52MotZoeU/NLNVMfuR+BToOVA+m/ETIbUNNDCNaZE7kjwazWi66Aop3QJ8M3I7UgEK9Jwws7HAgyG1U5lKg/97SlIgK8sfgb5gZsFHGEn1KNDz5TPgPwHaQQeP83gF2pE86KIryef/KeB3EduRClKg54iZrSNw3+mlLGUVmgKtRbOYxQ52hJZ/Um+E5ocCPX++A2HJ/BiPhb7qLTm1n/1MYlJo+X1mNj1mP1JZCvScKR8k8KmQ2p3s5EmejNyRZNkEJoQeJL4f+PfI7UiFKdBzyMxGAqNCaiczmSb0fKsWbGUrT4edlwKlM0I3xOxHKk+Bnl+fBP8jitpoYwxjKtCOZM1oRmP+Z6UArAW+G7kdqQIFek6VX/L4TkjtQhZST33chiRTlrAkyef4c9qvJZ8U6Pn2bWBdSGGC0ZtkXCedSX4Km2xmf4zZj1SPAj3HzGw/pbXp3raylflh261Lxs1gRuiLZF2UpvIkpxToOWdmDwLjQmrHM177vBTMXvYyhSmh5XeY2TMx+5HqUqAXw8fB/4iiRhqZycwKtCNpGcc42mgLKd0D/GfkdqTKFOgFYGZLgR+F1E5hCs3o+VcRbGIT85gXWv41M9sesx+pPgV6cXwN2Oxb1EqrjqsriAQHmiwHfhKxFUmJAr0gyrvh/VtI7WxmazfGnFvAAjYQ/B7QZ8pbNEvOKdCL5V5grm9RJ508wRMVaEeqoZ12xoU9FwcYbWZBbx1L9ijQC6S8K17QKH0hC9nEpsgdSTVMYxqNNIaUtgOfjtyOpEiBXjBmNg7CNr8ey9jI3Uil7WFPkhOpflZ+oC4FoUAvpn8D/7PG6qlnBSsq0I5UyjjGhb5LsAP4auR2JGUK9AIys/nA3SG14xinLQFyYhvbWMSi0PIvmpmehBeMAr24vgT+G2FvYxvPoJcF82A840O/+c4Hbo/cjmSAAr2gzGw98OOQ2glM0JYAGbeRjSxjWWj5J81MR1cVkAK92L4N7PItaqKJGcyoQDsSy3jGh5Y+aGYTI7YiGaJAL7DyHOk3QmqnMY397I/ckcRQTz2rWR1S2gL8a+R2JEMU6MX3M/A/6aCV1iSHC0sFJRid/9zM6iO2IhmjQC84M2sjcBe9p3iKXf4zNlJBK1jBetaHlO6lNAUnBaZArw33A3N8i7ro0pYAGZNgdP5D7aZYfAr0GlDeEuBzIbWLWcxGNkbuSEIsZjFb2BJSuhsd+lwTFOg1wszGA6NDaicwIXI34suwJJ+H/zWzPTH7kWxSoNeWoC0BVrEqdN5WIpnHPHawI6R0K4HvI0j+KNBriJktAO4KqZ3IxLjNSLd10ZVkxdE3y4eJSw1QoNeeoC0BVrOadayrQDtyLE/zdOgBJGuBX0ZuRzJMgV5jzGwDgeePai69+jroSHJE4NfKy1alRijQa1PQlgD15Q+pnlnMYi97Q0qXA7+L3I5knAK9BpVXPHw/pFZz6dXTRhtTmRpa/mVtwFV7FOi168fATt+itaxlDWsq0I481wxm0ExzSOk84IHI7UgOKNBrlJk1EfiyiebSK6+Z5iQ7Xn6x/DKZ1BgFem37Kfgvbl7P+tDd/qSbpjKVVlpDSmeY2cjY/Ug+KNBrmJntBb4TUqtReuXsZS+zmBVaHrQRmxSDAl1+BmzzLdrABlaysgLtyGQmh54YNc7M9J22hinQa5yZ7QP+N6RWK17ia6CBOf4bYx6g0XmNU6ALwM8p7fnhZSMbWcGKCrRTuyYxiU6CVhv+xcyC52mkGBToQnmvj/8JqdVcejw72ck85oWUdlHa0kFqnAJdDvgFsNm3aDObk5w+L4eYwASMoNWGvy9vvCY1ToEuAJhZM/DfIbWaS09uC1tYxKKQ0g7gvyK3IzmlQJdD/QrY5Fu0hS0sZWkF2qkdCY6Wu9PMtNxIAAW6HMLMWgg8SFij9HAb2BD6cLkV+FrkdiTHFOjyXL8GNvgWbWWrRumBEnwz/Hl5O2QRQIEuz2FmrcC3QmqnMS1yN8W3la2sYlVI6T4Cf5qS4lKgy+HcAf7HE21gg0418jSd6aGlPzQz7zd8pdgU6PI85VNugkbpCfbvrjmNNLKQhSGluwncKVOKTYEuR/IbSmdSelnBCrb5bw1Tk2Yyky66Qkq/Y2ZBh4xKsSnQ5bDMrB34RkhtgmmEmtFKK0/zdEjpdkqHk4g8jwJdjuZ3wHrfogUsoJHGCrRTHE/zdOh+5z8qb6gm8jwKdDmi8ijd++zRLrqSnLZTeF10MZOZIaX7KG2kJnJYCnQ5ltspPYTzMoc5tNBSgXbybyELQ3+CudPMdsXuR4pDgS5HVT7V6Ge+dW20JTl1p9ACnzF0Aj+I3IoUjAJduuPH4H/8/CxmhZ68U1irWMVW/63nAf5kZjrIVY5KgS7HZGbbgTt96/axj2d4pgId5VeCFUBady7HpECX7voe+B+lM53poXt8F85WtrKaoEH2FJ1GJN2hQJduKf+4/0ffut3sZjGLK9BR/iQYnX8nZh9SXAp08RF0mLQ27Ur0mv9SYGTkdqSgFOjSbWY2FxjrW7eZzaFTDYXxJE+Gvub/fTPTnJV0iwJdfAUdJl3Lo/QEr/lvA+6O3I4UmAJdvJjZE+CfTqtZzRa2VKCj7Huap2mjLaT0J+VTpES6RYEuIYJG6bW4tW4XXTzJ8u+StgAACpJJREFUkyGl+9Fr/uJJgS4hHgS8DyZezGJ2++8ikGsLWEATTSGld5rZztj9SLEp0MWbmXUR8KKLYTW3aVfgUsUuAjZFE1GgS6jfgf877M/wTOi2sbmzilWhh33oNX8JokCXIOWHdd4HLbTTXjPbASRY2aPX/CWIAl2SuA38J4hnM7sCrWTLFrawhjUhpVPNLGizdBEFugQrn2v5K9+6news/ItGes1f0qBAl6R+ALT7FhV5lL6HPSxiUUjpMuCRyO1IDVGgSyJmtpHSMkYvy1hW2HNH9Zq/pEWBLjF4n2hkGE/xVCV6SVUrrcxhTkjpNuCuyO1IjVGgS2JmNhWY51s3hzl0+m+xnmlP8VToa/4/1Wv+kpQCXWLxHqXvY1+h9krvpJOZBC1Q2U9pxZBIIgp0ieVeoMG3qEgHSS9kYehr/r/Va/4SgwJdojCz/cBvfes2sIHNbI7fUAoCt8jVa/4SjQJdYvo5+B8gWoQljNvYxnrWh5Q+ZGarYvcjtUmBLtGY2XICTjRawAJayPfzwMDROeg1f4lIgS6xeT8c7aCDucytRC9V0U478/wX+QBMM7OgzdJFDkeBLrGNBNb6FuV52mURi0J3kPxe7F6ktinQJaryXum/8K3bzW5W+p+ZkQmBL0htBB6O3IrUOAW6VMLt4D9kzeMSxq1sZSMbQ0rvMLNivVUlqVOgS3RmtgN4wLduJStzd0Rd4Oi8k9I3PZGoFOhSKYXf36WddhawIKT0MTMLWuMocjQKdKmI8iEN3mv55jKXDjoq0FF8C1gQ+jDU+xmDSHco0KWSvEfpzTSzkIWV6CW6wLXn64DHIrciAijQpbLuB3b5FuXhzNHNbGYTm0JKby+vBBKJToEuFVPeDvY3vnVrWUuD/z5fVRU4Ou8A7ojcishBCnSptJ+D//E9gW9eVkUbbaEPQx8xs6BhvUh3KNClosxsNQFzxlkO9AUsCD3E4pexexE5lAJdqsE7yHazm3Wsq0QviQVuU7AGGBO5FZFnUaBLNTxG6cxML1kcpW9hC1vZGlL6ax0ALZWmQJeKM7MO4D7fukUsytya9MBvMu0EPBwW8aVAl2r5nW9BK60sZWklegliWOga+T+bWdCwXsSHAl2qwsyeAeb71mVpTfoqVrGXvSGlehgqVaFAl2ryHqWvZnXowcvRzff/fgSlN0PHR25F5LAU6FJN94LfpLhhoUEaVRttodM/9+hhqFSLAl2qpjyP/LhvXRZWuyxmMe20h5TeFbsXkSNRoEu1eU+7bGd76L4p0QT+lDDLzJbF7kXkSBToUm0Pg/9GLWmO0htppJ76kNK7I7ciclQKdKkqM2sFfu9bt4AFdPlvCRPFAhZgeE+DtxPw7ymShAJd0uA97dJMM8tZXolejinwp4NHy0fxiVSNAl2qzsyeBP90TmNN+ha2sJ3tIaWabpGqU6BLWrxXf6xgBfvZX4lejihwdL4bGBm5FZFjUqBLWu4Gv4npLrqqejxdglf9/1B+ViBSVQp0SYWZrQMm+NZVc9olwav+mm6RVCjQJU3eD0c3szl0Tttb4NrzlWY2PXYvIt2hQJc0PQj+Q+BqrEnvoINlBL0TpNG5pEaBLqkxs32UQt3LYhZXoJtnW8nK0GPm7ondi0h3KdAlbd7TLrvZzRa2VKKXg5awJKRsavkMVZFUKNAlbRPB//DQwMDtlk46Nd0iuaRAl1SVt5b9rW9dJaddVrOaVrxXHXYCf6pAOyLdpkCXLPA+b3RH+aMSAr9ZTNSr/pI2BbqkrrzFrHeKVmKU3kVX6HTL/8XuRcSXAl2ywnu6ohLz6GtYQzPNvmVdwEPRmxHxpECXrPBevriFLexmd9QmAkf9U8qnMYmkSoEumWBmzwDeS/5ijtINCz03VNMtkgkKdMmSVKdd1rI2ZDdHQ6tbJCMU6JIl3sG4gQ000hjl5oHTLdPNLN0DT0XKFOiSJU+C/2nQgdMkz2JY6Ghf0y2SGQp0yYzyS0beq0ViLF9cz/qQrXKNgIe5IpWiQJes8Z52Wcc69rEv0U0DvynMMrP1iW4sEpECXbJmEvi9AppgdcpBmm6RIlCgS6aYWSfwsG9dktUu61kf+mBVgS6ZokCXLPKel17DGlpoCbpZ4DeDp82sPuiGIhWiQJcsGgd+Q+YEe7CwghUhZRqdS+Yo0CVzzKwNGOVbF/Jgs4GG0F0bFeiSOQp0ySrvaZdVrPI+Nm4lK31vA7DAzIIKRSpJgS5Z9Rj4bXvYSSfLWe51k8DplkdDikQqTYEumWRm+4HRvnU+yxc76WQNa3xvAQHTQSLVoECXLPN+yWgVqzCsW7+3nnraafe9RQMww7dIpBoU6JJlj4Bf4rbQwkY2duv3Bk63jDGzjpBCkUpToEtmmdke4In/3969vEYRRFEcPgWuBEERXLkU//+lj4UtYnyLDxB85CGJOhhHE1R8JPG4cBYqaqZqqrvnlr8vu2Tu7V7oobhdXZNbt6rVuT7H/BytIdCx7LIP65on0N/OfjJZPx7WAkuJQMeyyw7QLW0d+tZo4XbFO7ZflxQCQyDQsdRmpxlmvZtv+dDdK4XjFna3YKkR6IjgQm7Bv8Yu+9rXhjZK7oP5OZYagY4IzucW/Guksq517St7o8q2pNu5RcCQCHREcFnSl5yCXe1qqukf/1Y4bjln+1tJITAUAh1Lb/bW6JXcur+NXdiuiFYR6Iiiyhx9qql2tJPb6kAFYx9gaAQ6osgO1HWt60AHv/yucLviNdvvSgqBIRHoCMH2A0mvcmr2tKdN/fodzuxuQcsIdESy8NjluZ6XXJdARwgEOiLJDvSfRywTTfQp74h1SXpl+35uETAGAh2RXJTmPBt3ZqKJPuqjpOJxy6WSImAMBDrCsL0t6W5u3ZrWJBUHeldSBIyBQEc0RW+NWi6dn3clRcAYCHREkz1HX9OaJpocegLjH7y0XfQWEjAGAh3RrEh6n1PwQR90XddLrtWVFAFjIdARiu09FTyofKiHJZfrSoqAsRDoiCh7jj7vF0f/pispAsaS7KJ/6MBoUkpnpLITtjK8sH2652sAVbFCRzi2n0mzvYj96XruD1RHoCOqvk8/7HruD1RHoCMqAh34DTN0hJRSOi7praTUQ3vm5wiJFTpCsr0j6VFP7bue+gK9ItAR2UpPfbue+gK9ItARGYEO/IRAR2R9BPrWbFskEA6BjrBsP5E0rdz2cuV+wGAIdERXe5V+tXI/YDAEOqKrHeg3KvcDBkOgI7qagf5ZKjuWEVgGBDqiuyVpr1Kvu7PjeYGQCHSEZvuTpHuV2t2s1AcYBYGOFtQauzA/R2gEOlpAoAPicC40IKV0WtLmgm22bZ+qcT/AWFihIzzbW1o80JmfIzwCHa1YdOxCoCM8Ah2tWDTQmZ8jPAIdrWCFjv8eD0XRhJTSEUm7ko4WlD+1fbbyLQGDY4WOJtje14+3RkswbkETCHS0pHTswrgFTSDQ0ZLSQGeFjiYwQ0czUkonJb3JLPsq6Zjtrz3cEjAoVuhohu2ppMeZZfcIc7SCQEdrcscuzM/RDAIdrckNdObnaAaBjtbkficoK3Q0g4eiaEpKKUmaSjoxx8ffSTpp/hOgEazQ0ZRZOF+b8+O3CHO05Ds86C6XJkuc+AAAAABJRU5ErkJggg==';

    img.src = data;
    img.width = 18;
    img.height = 28;
    if (img.complete) {
      ctx.drawImage(img, x - 11, y - 28, img.width, img.height);
    } else {
      img.onload = function () {
        ctx.drawImage(img, x - 11, y - 28, img.width, img.height);
      };
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  draw_start(ctx: any, x: any, y: any) {
    ctx.beginPath();

    ctx.fillStyle = 'green';
    ctx.arc(x, y, 5, 0, 3 * Math.PI, false);
    ctx.fill();

    ctx.fillText('Start', x + 5, y + 5, 200, 100);

    ctx.stroke();
    ctx.closePath();
  }

  draw_circle(ctx: any, x: any, y: any, title: string) {
    ctx.beginPath();

    ctx.fillStyle = 'black';
    ctx.arc(x, y, 5, 0, 3 * Math.PI, false);
    ctx.fill();
    ctx.fillText(title, x + 5, y + 5, 200, 100);
    ctx.stroke();
    ctx.closePath();
  }
  draw_end(ctx: any, x: any, y: any) {
    ctx.beginPath();

    ctx.fillStyle = 'yellow';
    ctx.arc(x, y, 5, 0, 3 * Math.PI, false);
    ctx.fill();

    ctx.fillText('End', x + 5, y + 5, 200, 100);

    ctx.stroke();
    ctx.closePath();
  }

  draw_arrow(ctx: any, fromx: any, fromy: any, tox: any, toy: any) {
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(158, 151, 151)';

    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);

    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );

    ctx.moveTo(tox, toy);

    ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );

    ctx.stroke();
    ctx.closePath();
  }
  draw() {
    // Main entry point got the map canvas example
    if (this.shadowRoot == undefined) return;
    var canvas = this.shadowRoot?.getElementById('map') as HTMLCanvasElement;
    var ctx: any; //= canvas.getContext('2d');
    // Canvas supported?
    if (!canvas) return;
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');

      // Draw the background
      this.drawBackground(ctx);

      // Draw the map background
      this.drawMapBackground(ctx);

      // Draw the map background
      this.drawGraticule(ctx);

      // Draw the land
      this.drawLandMass(ctx);

      this.plotPosition();
    } else {
      alert('Canvas not supported!');
    }
  }
  getMapData() {
    // The map data!
    var json = {
      shapes: [
        [
          {
            lat: '48.24',
            lon: '-92.32',
          },
          {
            lat: '48.92',
            lon: '-88.13',
          },
          {
            lat: '46.27',
            lon: '-83.11',
          },
          {
            lat: '44.76',
            lon: '-81.66',
          },
          {
            lat: '42.29',
            lon: '-82.09',
          },
          {
            lat: '44.00',
            lon: '-77.10',
          },
          {
            lat: '46.92',
            lon: '-69.95',
          },
          {
            lat: '45.32',
            lon: '-65.92',
          },
          {
            lat: '44.25',
            lon: '-66.37',
          },
          {
            lat: '45.43',
            lon: '-61.22',
          },
          {
            lat: '47.34',
            lon: '-64.94',
          },
          {
            lat: '48.52',
            lon: '-64.12',
          },
          {
            lat: '47.02',
            lon: '-70.68',
          },
          {
            lat: '49.33',
            lon: '-67.24',
          },
          {
            lat: '50.48',
            lon: '-59.82',
          },
          {
            lat: '52.46',
            lon: '-56.14',
          },
          {
            lat: '53.58',
            lon: '-59.07',
          },
          {
            lat: '54.21',
            lon: '-58.26',
          },
          {
            lat: '55.33',
            lon: '-60.69',
          },
          {
            lat: '57.41',
            lon: '-61.97',
          },
          {
            lat: '59.49',
            lon: '-64.35',
          },
          {
            lat: '58.15',
            lon: '-67.29',
          },
          {
            lat: '59.91',
            lon: '-69.89',
          },
          {
            lat: '61.45',
            lon: '-71.31',
          },
          {
            lat: '61.97',
            lon: '-78.22',
          },
          {
            lat: '59.53',
            lon: '-77.28',
          },
          {
            lat: '55.88',
            lon: '-77.09',
          },
          {
            lat: '51.68',
            lon: '-79.06',
          },
          {
            lat: '52.70',
            lon: '-82.23',
          },
          {
            lat: '55.72',
            lon: '-86.75',
          },
          {
            lat: '56.86',
            lon: '-92.17',
          },
          {
            lat: '58.82',
            lon: '-95.61',
          },
          {
            lat: '62.02',
            lon: '-92.66',
          },
          {
            lat: '63.24',
            lon: '-90.65',
          },
          {
            lat: '64.12',
            lon: '-95.96',
          },
          {
            lat: '63.98',
            lon: '-89.88',
          },
          {
            lat: '65.22',
            lon: '-89.30',
          },
          {
            lat: '66.12',
            lon: '-86.86',
          },
          {
            lat: '66.88',
            lon: '-84.54',
          },
          {
            lat: '67.76',
            lon: '-82.30',
          },
          {
            lat: '69.68',
            lon: '-83.10',
          },
          {
            lat: '67.98',
            lon: '-86.05',
          },
          {
            lat: '68.20',
            lon: '-88.18',
          },
          {
            lat: '68.82',
            lon: '-91.00',
          },
          {
            lat: '69.69',
            lon: '-91.72',
          },
          {
            lat: '71.09',
            lon: '-93.15',
          },
          {
            lat: '71.05',
            lon: '-96.58',
          },
          {
            lat: '69.52',
            lon: '-93.35',
          },
          {
            lat: '68.25',
            lon: '-94.23',
          },
          {
            lat: '66.73',
            lon: '-95.96',
          },
          {
            lat: '68.27',
            lon: '-98.83',
          },
          {
            lat: '67.69',
            lon: '-102.45',
          },
          {
            lat: '68.43',
            lon: '-108.34',
          },
          {
            lat: '68.05',
            lon: '-105.83',
          },
          {
            lat: '66.60',
            lon: '-108.15',
          },
          {
            lat: '67.63',
            lon: '-111.15',
          },
          {
            lat: '68.23',
            lon: '-114.10',
          },
          {
            lat: '69.44',
            lon: '-120.92',
          },
          {
            lat: '69.26',
            lon: '-124.32',
          },
          {
            lat: '70.50',
            lon: '-128.76',
          },
          {
            lat: '69.19',
            lon: '-131.86',
          },
          {
            lat: '69.79',
            lon: '-131.15',
          },
          {
            lat: '69.13',
            lon: '-135.81',
          },
          {
            lat: '69.37',
            lon: '-140.19',
          },
          {
            lat: '69.58',
            lon: '-141.20',
          },
          {
            lat: '69.56',
            lon: '-141.21',
          },
          {
            lat: '69.83',
            lon: '-142.49',
          },
          {
            lat: '70.26',
            lon: '-148.09',
          },
          {
            lat: '70.96',
            lon: '-154.37',
          },
          {
            lat: '70.38',
            lon: '-159.53',
          },
          {
            lat: '68.25',
            lon: '-166.64',
          },
          {
            lat: '66.55',
            lon: '-161.56',
          },
          {
            lat: '65.97',
            lon: '-162.99',
          },
          {
            lat: '65.49',
            lon: '-168.23',
          },
          {
            lat: '64.49',
            lon: '-161.12',
          },
          {
            lat: '62.57',
            lon: '-165.29',
          },
          {
            lat: '60.06',
            lon: '-164.58',
          },
          {
            lat: '58.36',
            lon: '-162.06',
          },
          {
            lat: '58.12',
            lon: '-157.85',
          },
          {
            lat: '55.06',
            lon: '-162.34',
          },
          {
            lat: '57.11',
            lon: '-156.52',
          },
          {
            lat: '59.32',
            lon: '-153.53',
          },
          {
            lat: '60.81',
            lon: '-149.18',
          },
          {
            lat: '59.50',
            lon: '-149.90',
          },
          {
            lat: '60.36',
            lon: '-146.54',
          },
          {
            lat: '59.73',
            lon: '-139.98',
          },
          {
            lat: '58.28',
            lon: '-137.12',
          },
          {
            lat: '59.12',
            lon: '-136.01',
          },
          {
            lat: '57.12',
            lon: '-133.84',
          },
          {
            lat: '55.98',
            lon: '-131.46',
          },
          {
            lat: '57.20',
            lon: '-132.08',
          },
          {
            lat: '60.25',
            lon: '-140.37',
          },
          {
            lat: '60.16',
            lon: '-141.21',
          },
          {
            lat: '58.93',
            lon: '-133.38',
          },
          {
            lat: '54.83',
            lon: '-130.88',
          },
          {
            lat: '53.90',
            lon: '-128.86',
          },
          {
            lat: '52.12',
            lon: '-126.58',
          },
          {
            lat: '50.80',
            lon: '-127.08',
          },
          {
            lat: '49.66',
            lon: '-124.42',
          },
          {
            lat: '48.91',
            lon: '-122.56',
          },
          {
            lat: '48.92',
            lon: '-122.44',
          },
          {
            lat: '47.18',
            lon: '-124.42',
          },
          {
            lat: '42.48',
            lon: '-124.52',
          },
          {
            lat: '38.45',
            lon: '-123.09',
          },
          {
            lat: '36.62',
            lon: '-121.73',
          },
          {
            lat: '33.34',
            lon: '-117.60',
          },
          {
            lat: '32.64',
            lon: '-117.28',
          },
          {
            lat: '32.48',
            lon: '-117.29',
          },
          {
            lat: '27.80',
            lon: '-114.75',
          },
          {
            lat: '24.80',
            lon: '-112.53',
          },
          {
            lat: '24.07',
            lon: '-110.55',
          },
          {
            lat: '29.59',
            lon: '-114.23',
          },
          {
            lat: '29.99',
            lon: '-112.58',
          },
          {
            lat: '25.94',
            lon: '-109.57',
          },
          {
            lat: '21.94',
            lon: '-105.61',
          },
          {
            lat: '17.87',
            lon: '-102.09',
          },
          {
            lat: '15.94',
            lon: '-95.75',
          },
          {
            lat: '14.97',
            lon: '-92.21',
          },
          {
            lat: '14.71',
            lon: '-92.22',
          },
          {
            lat: '12.06',
            lon: '-86.74',
          },
          {
            lat: '8.65',
            lon: '-83.03',
          },
          {
            lat: '8.74',
            lon: '-79.93',
          },
          {
            lat: '7.82',
            lon: '-77.00',
          },
          {
            lat: '8.97',
            lon: '-81.99',
          },
          {
            lat: '12.70',
            lon: '-83.92',
          },
          {
            lat: '15.80',
            lon: '-86.33',
          },
          {
            lat: '15.92',
            lon: '-88.40',
          },
          {
            lat: '17.42',
            lon: '-88.45',
          },
          {
            lat: '21.33',
            lon: '-87.01',
          },
          {
            lat: '18.72',
            lon: '-91.65',
          },
          {
            lat: '20.37',
            lon: '-96.96',
          },
          {
            lat: '25.67',
            lon: '-97.65',
          },
          {
            lat: '25.82',
            lon: '-97.62',
          },
          {
            lat: '28.84',
            lon: '-95.62',
          },
          {
            lat: '29.03',
            lon: '-90.77',
          },
          {
            lat: '30.22',
            lon: '-87.33',
          },
          {
            lat: '28.15',
            lon: '-82.69',
          },
          {
            lat: '26.66',
            lon: '-80.16',
          },
          {
            lat: '32.31',
            lon: '-80.74',
          },
          {
            lat: '35.43',
            lon: '-76.89',
          },
          {
            lat: '38.21',
            lon: '-76.47',
          },
          {
            lat: '37.67',
            lon: '-75.66',
          },
          {
            lat: '41.76',
            lon: '-71.31',
          },
          {
            lat: '44.17',
            lon: '-69.44',
          },
          {
            lat: '47.03',
            lon: '-67.69',
          },
          {
            lat: '45.14',
            lon: '-73.18',
          },
          {
            lat: '43.28',
            lon: '-79.26',
          },
          {
            lat: '42.59',
            lon: '-82.84',
          },
          {
            lat: '45.32',
            lon: '-83.49',
          },
          {
            lat: '43.65',
            lon: '-86.36',
          },
          {
            lat: '43.42',
            lon: '-87.75',
          },
          {
            lat: '45.96',
            lon: '-86.01',
          },
          {
            lat: '46.59',
            lon: '-87.00',
          },
          {
            lat: '46.79',
            lon: '-91.39',
          },
          {
            lat: '47.96',
            lon: '-90.05',
          },
        ],
        [
          {
            lat: '58.41',
            lon: '-152.62',
          },
          {
            lat: '58.40',
            lon: '-152.60',
          },
        ],
        [
          {
            lat: '57.80',
            lon: '-153.30',
          },
          {
            lat: '57.48',
            lon: '-152.40',
          },
          {
            lat: '57.79',
            lon: '-153.32',
          },
        ],
        [
          {
            lat: '53.96',
            lon: '-166.96',
          },
          {
            lat: '53.95',
            lon: '-167.01',
          },
        ],
        [
          {
            lat: '53.50',
            lon: '-168.36',
          },
          {
            lat: '53.36',
            lon: '-168.19',
          },
        ],
        [
          {
            lat: '52.68',
            lon: '-170.73',
          },
          {
            lat: '52.55',
            lon: '-170.60',
          },
        ],
        [
          {
            lat: '51.94',
            lon: '-174.47',
          },
          {
            lat: '51.92',
            lon: '-174.47',
          },
        ],
        [
          {
            lat: '51.71',
            lon: '-176.58',
          },
          {
            lat: '51.73',
            lon: '-176.64',
          },
        ],
        [
          {
            lat: '51.76',
            lon: '-177.55',
          },
          {
            lat: '51.63',
            lon: '-177.41',
          },
        ],
        [
          {
            lat: '51.75',
            lon: '-178.27',
          },
        ],
        [
          {
            lat: '51.80',
            lon: '177.35',
          },
          {
            lat: '51.76',
            lon: '177.33',
          },
        ],
        [
          {
            lat: '53.00',
            lon: '172.44',
          },
          {
            lat: '53.03',
            lon: '172.55',
          },
        ],
        [
          {
            lat: '48.33',
            lon: '-123.40',
          },
          {
            lat: '50.84',
            lon: '-128.00',
          },
          {
            lat: '48.34',
            lon: '-123.50',
          },
        ],
        [
          {
            lat: '52.88',
            lon: '-132.49',
          },
          {
            lat: '52.91',
            lon: '-132.44',
          },
        ],
        [
          {
            lat: '53.02',
            lon: '-132.64',
          },
          {
            lat: '53.71',
            lon: '-131.97',
          },
          {
            lat: '53.02',
            lon: '-132.63',
          },
        ],
        [
          {
            lat: '51.56',
            lon: '-55.36',
          },
          {
            lat: '49.52',
            lon: '-54.66',
          },
          {
            lat: '47.48',
            lon: '-53.65',
          },
          {
            lat: '46.31',
            lon: '-52.98',
          },
          {
            lat: '46.84',
            lon: '-56.12',
          },
          {
            lat: '47.57',
            lon: '-58.47',
          },
          {
            lat: '50.38',
            lon: '-57.61',
          },
          {
            lat: '51.53',
            lon: '-55.39',
          },
        ],
        [
          {
            lat: '49.01',
            lon: '-61.37',
          },
          {
            lat: '49.29',
            lon: '-61.80',
          },
          {
            lat: '49.03',
            lon: '-61.38',
          },
        ],
        [
          {
            lat: '46.71',
            lon: '-63.01',
          },
          {
            lat: '46.61',
            lon: '-64.42',
          },
          {
            lat: '46.68',
            lon: '-63.04',
          },
        ],
        [
          {
            lat: '46.48',
            lon: '-60.14',
          },
          {
            lat: '46.50',
            lon: '-60.14',
          },
        ],
        [
          {
            lat: '41.11',
            lon: '-71.97',
          },
          {
            lat: '41.15',
            lon: '-71.97',
          },
        ],
        [
          {
            lat: '27.03',
            lon: '-80.79',
          },
          {
            lat: '26.99',
            lon: '-81.01',
          },
        ],
        [
          {
            lat: '42.09',
            lon: '-113.01',
          },
          {
            lat: '42.01',
            lon: '-113.10',
          },
        ],
        [
          {
            lat: '20.02',
            lon: '-155.74',
          },
          {
            lat: '19.98',
            lon: '-155.73',
          },
        ],
        [
          {
            lat: '20.78',
            lon: '-156.51',
          },
          {
            lat: '20.78',
            lon: '-156.51',
          },
        ],
        [
          {
            lat: '21.21',
            lon: '-157.12',
          },
          {
            lat: '20.95',
            lon: '-157.08',
          },
        ],
        [
          {
            lat: '21.42',
            lon: '-157.87',
          },
        ],
        [
          {
            lat: '22.07',
            lon: '-159.53',
          },
        ],
        [
          {
            lat: '66.46',
            lon: '-117.44',
          },
          {
            lat: '65.24',
            lon: '-119.59',
          },
          {
            lat: '65.03',
            lon: '-123.95',
          },
          {
            lat: '66.44',
            lon: '-123.69',
          },
          {
            lat: '66.22',
            lon: '-119.21',
          },
          {
            lat: '66.44',
            lon: '-117.44',
          },
        ],
        [
          {
            lat: '64.03',
            lon: '-120.71',
          },
          {
            lat: '62.30',
            lon: '-114.91',
          },
          {
            lat: '62.72',
            lon: '-109.07',
          },
          {
            lat: '61.19',
            lon: '-112.62',
          },
          {
            lat: '61.19',
            lon: '-118.68',
          },
          {
            lat: '61.17',
            lon: '-117.01',
          },
          {
            lat: '62.56',
            lon: '-115.97',
          },
          {
            lat: '64.00',
            lon: '-119.46',
          },
          {
            lat: '63.94',
            lon: '-120.59',
          },
        ],
        [
          {
            lat: '58.46',
            lon: '-112.31',
          },
          {
            lat: '59.44',
            lon: '-108.90',
          },
          {
            lat: '58.90',
            lon: '-104.14',
          },
          {
            lat: '56.72',
            lon: '-102.56',
          },
          {
            lat: '58.73',
            lon: '-101.82',
          },
          {
            lat: '58.91',
            lon: '-104.65',
          },
          {
            lat: '58.51',
            lon: '-111.00',
          },
          {
            lat: '58.62',
            lon: '-112.35',
          },
        ],
        [
          {
            lat: '50.09',
            lon: '-98.74',
          },
          {
            lat: '52.24',
            lon: '-99.75',
          },
          {
            lat: '51.47',
            lon: '-99.62',
          },
          {
            lat: '50.39',
            lon: '-98.82',
          },
        ],
        [
          {
            lat: '50.21',
            lon: '-97.02',
          },
          {
            lat: '54.02',
            lon: '-97.50',
          },
          {
            lat: '52.93',
            lon: '-98.69',
          },
          {
            lat: '51.09',
            lon: '-97.19',
          },
          {
            lat: '50.20',
            lon: '-96.98',
          },
        ],
        [
          {
            lat: '49.04',
            lon: '-95.34',
          },
          {
            lat: '50.34',
            lon: '-92.32',
          },
          {
            lat: '49.47',
            lon: '-94.14',
          },
          {
            lat: '48.82',
            lon: '-95.36',
          },
        ],
        [
          {
            lat: '56.16',
            lon: '-80.39',
          },
          {
            lat: '55.94',
            lon: '-79.22',
          },
          {
            lat: '56.08',
            lon: '-80.34',
          },
        ],
        [
          {
            lat: '58.60',
            lon: '-103.56',
          },
          {
            lat: '58.58',
            lon: '-103.60',
          },
        ],
        [
          {
            lat: '58.03',
            lon: '-101.82',
          },
          {
            lat: '58.10',
            lon: '-102.33',
          },
          {
            lat: '58.06',
            lon: '-101.77',
          },
        ],
        [
          {
            lat: '55.79',
            lon: '-101.88',
          },
          {
            lat: '57.15',
            lon: '-97.92',
          },
          {
            lat: '55.85',
            lon: '-101.22',
          },
          {
            lat: '55.74',
            lon: '-101.88',
          },
        ],
        [
          {
            lat: '6.80',
            lon: '-77.61',
          },
          {
            lat: '0.97',
            lon: '-78.70',
          },
          {
            lat: '-4.47',
            lon: '-80.75',
          },
          {
            lat: '-14.57',
            lon: '-76.19',
          },
          {
            lat: '-18.75',
            lon: '-70.44',
          },
          {
            lat: '-26.15',
            lon: '-70.68',
          },
          {
            lat: '-32.03',
            lon: '-71.44',
          },
          {
            lat: '-37.27',
            lon: '-73.38',
          },
          {
            lat: '-42.11',
            lon: '-73.06',
          },
          {
            lat: '-46.09',
            lon: '-73.17',
          },
          {
            lat: '-48.05',
            lon: '-73.52',
          },
          {
            lat: '-51.56',
            lon: '-73.67',
          },
          {
            lat: '-53.88',
            lon: '-71.06',
          },
          {
            lat: '-50.77',
            lon: '-69.14',
          },
          {
            lat: '-46.59',
            lon: '-67.51',
          },
          {
            lat: '-42.80',
            lon: '-63.49',
          },
          {
            lat: '-40.16',
            lon: '-62.14',
          },
          {
            lat: '-36.71',
            lon: '-57.12',
          },
          {
            lat: '-34.15',
            lon: '-53.17',
          },
          {
            lat: '-32.02',
            lon: '-51.26',
          },
          {
            lat: '-25.48',
            lon: '-48.16',
          },
          {
            lat: '-22.32',
            lon: '-40.73',
          },
          {
            lat: '-15.24',
            lon: '-38.88',
          },
          {
            lat: '-7.81',
            lon: '-34.60',
          },
          {
            lat: '-3.42',
            lon: '-41.95',
          },
          {
            lat: '-1.84',
            lon: '-48.02',
          },
          {
            lat: '-1.57',
            lon: '-48.44',
          },
          {
            lat: '0.00',
            lon: '-50.81',
          },
          {
            lat: '5.39',
            lon: '-54.47',
          },
          {
            lat: '8.32',
            lon: '-60.59',
          },
          {
            lat: '9.88',
            lon: '-64.19',
          },
          {
            lat: '10.64',
            lon: '-70.78',
          },
          {
            lat: '11.89',
            lon: '-70.97',
          },
          {
            lat: '8.76',
            lon: '-76.26',
          },
          {
            lat: '6.80',
            lon: '-77.61',
          },
        ],
        [
          {
            lat: '-52.79',
            lon: '-69.14',
          },
          {
            lat: '-55.08',
            lon: '-66.16',
          },
          {
            lat: '-54.88',
            lon: '-70.01',
          },
          {
            lat: '-53.85',
            lon: '-70.55',
          },
          {
            lat: '-52.81',
            lon: '-69.31',
          },
        ],
        [
          {
            lat: '-51.58',
            lon: '-59.29',
          },
          {
            lat: '-51.54',
            lon: '-59.35',
          },
        ],
        [
          {
            lat: '-51.55',
            lon: '-58.65',
          },
          {
            lat: '-51.56',
            lon: '-58.55',
          },
        ],
        [
          {
            lat: '21.44',
            lon: '-84.39',
          },
          {
            lat: '19.73',
            lon: '-73.90',
          },
          {
            lat: '21.18',
            lon: '-79.27',
          },
          {
            lat: '21.80',
            lon: '-83.74',
          },
          {
            lat: '21.42',
            lon: '-84.32',
          },
        ],
        [
          {
            lat: '17.95',
            lon: '-66.96',
          },
          {
            lat: '17.89',
            lon: '-67.05',
          },
        ],
        [
          {
            lat: '17.22',
            lon: '-77.88',
          },
          {
            lat: '16.98',
            lon: '-78.06',
          },
        ],
        [
          {
            lat: '18.08',
            lon: '-74.47',
          },
          {
            lat: '18.99',
            lon: '-69.88',
          },
          {
            lat: '17.76',
            lon: '-71.10',
          },
          {
            lat: '17.86',
            lon: '-74.45',
          },
        ],
        [
          {
            lat: '73.74',
            lon: '-85.28',
          },
          {
            lat: '70.96',
            lon: '-85.79',
          },
          {
            lat: '71.94',
            lon: '-85.13',
          },
          {
            lat: '72.96',
            lon: '-84.74',
          },
          {
            lat: '73.10',
            lon: '-80.61',
          },
          {
            lat: '72.20',
            lon: '-78.45',
          },
          {
            lat: '72.55',
            lon: '-75.44',
          },
          {
            lat: '71.98',
            lon: '-73.89',
          },
          {
            lat: '71.04',
            lon: '-72.56',
          },
          {
            lat: '70.57',
            lon: '-71.49',
          },
          {
            lat: '70.29',
            lon: '-69.78',
          },
          {
            lat: '69.71',
            lon: '-68.12',
          },
          {
            lat: '69.19',
            lon: '-65.91',
          },
          {
            lat: '68.39',
            lon: '-66.92',
          },
          {
            lat: '67.68',
            lon: '-64.08',
          },
          {
            lat: '66.68',
            lon: '-62.50',
          },
          {
            lat: '65.33',
            lon: '-63.07',
          },
          {
            lat: '66.08',
            lon: '-66.11',
          },
          {
            lat: '65.41',
            lon: '-67.48',
          },
          {
            lat: '63.15',
            lon: '-64.05',
          },
          {
            lat: '63.26',
            lon: '-66.58',
          },
          {
            lat: '62.33',
            lon: '-69.04',
          },
          {
            lat: '63.77',
            lon: '-72.22',
          },
          {
            lat: '64.17',
            lon: '-76.88',
          },
          {
            lat: '65.54',
            lon: '-73.25',
          },
          {
            lat: '66.64',
            lon: '-70.09',
          },
          {
            lat: '67.44',
            lon: '-72.05',
          },
          {
            lat: '68.36',
            lon: '-76.32',
          },
          {
            lat: '70.17',
            lon: '-78.34',
          },
          {
            lat: '69.71',
            lon: '-82.12',
          },
          {
            lat: '70.12',
            lon: '-87.64',
          },
          {
            lat: '71.43',
            lon: '-89.68',
          },
          {
            lat: '73.74',
            lon: '-85.28',
          },
        ],
        [
          {
            lat: '76.10',
            lon: '-80.90',
          },
          {
            lat: '76.28',
            lon: '-84.21',
          },
          {
            lat: '76.38',
            lon: '-88.94',
          },
          {
            lat: '77.40',
            lon: '-85.47',
          },
          {
            lat: '77.93',
            lon: '-85.43',
          },
          {
            lat: '78.54',
            lon: '-87.01',
          },
          {
            lat: '78.94',
            lon: '-83.17',
          },
          {
            lat: '79.93',
            lon: '-84.87',
          },
          {
            lat: '79.82',
            lon: '-81.33',
          },
          {
            lat: '80.92',
            lon: '-76.27',
          },
          {
            lat: '80.62',
            lon: '-82.88',
          },
          {
            lat: '81.16',
            lon: '-82.58',
          },
          {
            lat: '81.05',
            lon: '-86.51',
          },
          {
            lat: '81.21',
            lon: '-89.36',
          },
          {
            lat: '81.38',
            lon: '-90.45',
          },
          {
            lat: '81.86',
            lon: '-89.28',
          },
          {
            lat: '82.30',
            lon: '-87.21',
          },
          {
            lat: '82.05',
            lon: '-80.51',
          },
          {
            lat: '82.55',
            lon: '-80.16',
          },
          {
            lat: '82.86',
            lon: '-77.83',
          },
          {
            lat: '83.05',
            lon: '-75.51',
          },
          {
            lat: '82.90',
            lon: '-71.18',
          },
          {
            lat: '82.78',
            lon: '-65.10',
          },
          {
            lat: '81.80',
            lon: '-63.34',
          },
          {
            lat: '81.26',
            lon: '-68.26',
          },
          {
            lat: '80.34',
            lon: '-69.46',
          },
          {
            lat: '79.82',
            lon: '-71.05',
          },
          {
            lat: '79.46',
            lon: '-74.40',
          },
          {
            lat: '79.03',
            lon: '-75.42',
          },
          {
            lat: '78.92',
            lon: '-75.48',
          },
          {
            lat: '78.20',
            lon: '-76.01',
          },
          {
            lat: '77.28',
            lon: '-80.66',
          },
          {
            lat: '76.98',
            lon: '-78.07',
          },
          {
            lat: '76.13',
            lon: '-80.90',
          },
        ],
        [
          {
            lat: '74.13',
            lon: '-92.86',
          },
          {
            lat: '72.70',
            lon: '-92.50',
          },
          {
            lat: '73.16',
            lon: '-94.89',
          },
          {
            lat: '74.14',
            lon: '-92.96',
          },
        ],
        [
          {
            lat: '76.95',
            lon: '-94.80',
          },
          {
            lat: '76.04',
            lon: '-89.68',
          },
          {
            lat: '75.40',
            lon: '-88.52',
          },
          {
            lat: '75.67',
            lon: '-82.36',
          },
          {
            lat: '74.65',
            lon: '-79.39',
          },
          {
            lat: '74.22',
            lon: '-86.15',
          },
          {
            lat: '74.94',
            lon: '-91.70',
          },
          {
            lat: '76.91',
            lon: '-95.60',
          },
          {
            lat: '76.96',
            lon: '-94.87',
          },
        ],
        [
          {
            lat: '73.74',
            lon: '-99.96',
          },
          {
            lat: '72.90',
            lon: '-97.89',
          },
          {
            lat: '71.13',
            lon: '-98.28',
          },
          {
            lat: '72.92',
            lon: '-102.04',
          },
          {
            lat: '73.14',
            lon: '-101.34',
          },
          {
            lat: '73.59',
            lon: '-99.69',
          },
        ],
        [
          {
            lat: '73.25',
            lon: '-107.58',
          },
          {
            lat: '71.02',
            lon: '-104.59',
          },
          {
            lat: '69.56',
            lon: '-101.71',
          },
          {
            lat: '68.62',
            lon: '-104.07',
          },
          {
            lat: '69.12',
            lon: '-106.61',
          },
          {
            lat: '69.05',
            lon: '-114.09',
          },
          {
            lat: '70.12',
            lon: '-113.89',
          },
          {
            lat: '70.32',
            lon: '-115.88',
          },
          {
            lat: '71.32',
            lon: '-116.10',
          },
          {
            lat: '72.48',
            lon: '-117.45',
          },
          {
            lat: '72.44',
            lon: '-113.53',
          },
          {
            lat: '72.24',
            lon: '-109.84',
          },
          {
            lat: '71.71',
            lon: '-106.62',
          },
          {
            lat: '73.04',
            lon: '-107.43',
          },
        ],
        [
          {
            lat: '74.29',
            lon: '-120.96',
          },
          {
            lat: '72.53',
            lon: '-118.37',
          },
          {
            lat: '71.18',
            lon: '-123.06',
          },
          {
            lat: '73.77',
            lon: '-123.40',
          },
          {
            lat: '74.27',
            lon: '-120.93',
          },
        ],
        [
          {
            lat: '76.74',
            lon: '-108.83',
          },
          {
            lat: '75.54',
            lon: '-106.25',
          },
          {
            lat: '74.78',
            lon: '-107.08',
          },
          {
            lat: '74.16',
            lon: '-112.99',
          },
          {
            lat: '74.99',
            lon: '-112.28',
          },
          {
            lat: '75.33',
            lon: '-116.04',
          },
          {
            lat: '76.20',
            lon: '-115.27',
          },
          {
            lat: '75.56',
            lon: '-110.95',
          },
          {
            lat: '76.31',
            lon: '-109.77',
          },
          {
            lat: '76.70',
            lon: '-108.82',
          },
        ],
        [
          {
            lat: '77.46',
            lon: '-115.70',
          },
          {
            lat: '76.30',
            lon: '-118.10',
          },
          {
            lat: '76.37',
            lon: '-121.13',
          },
          {
            lat: '77.28',
            lon: '-116.04',
          },
        ],
        [
          {
            lat: '77.86',
            lon: '-110.01',
          },
          {
            lat: '77.68',
            lon: '-112.36',
          },
          {
            lat: '77.86',
            lon: '-109.96',
          },
        ],
        [
          {
            lat: '78.48',
            lon: '-109.60',
          },
          {
            lat: '78.01',
            lon: '-112.20',
          },
          {
            lat: '78.48',
            lon: '-109.60',
          },
        ],
        [
          {
            lat: '76.61',
            lon: '-97.87',
          },
          {
            lat: '75.31',
            lon: '-99.21',
          },
          {
            lat: '75.60',
            lon: '-100.86',
          },
          {
            lat: '76.26',
            lon: '-99.40',
          },
          {
            lat: '76.60',
            lon: '-97.79',
          },
        ],
        [
          {
            lat: '75.53',
            lon: '-94.72',
          },
          {
            lat: '75.52',
            lon: '-94.66',
          },
        ],
        [
          {
            lat: '79.01',
            lon: '-104.10',
          },
          {
            lat: '77.54',
            lon: '-99.19',
          },
          {
            lat: '78.08',
            lon: '-103.22',
          },
          {
            lat: '78.95',
            lon: '-104.30',
          },
        ],
        [
          {
            lat: '77.52',
            lon: '-93.74',
          },
          {
            lat: '77.52',
            lon: '-93.74',
          },
        ],
        [
          {
            lat: '78.50',
            lon: '-96.88',
          },
          {
            lat: '77.77',
            lon: '-96.91',
          },
          {
            lat: '78.48',
            lon: '-96.94',
          },
        ],
        [
          {
            lat: '65.84',
            lon: '-84.69',
          },
          {
            lat: '63.87',
            lon: '-81.58',
          },
          {
            lat: '62.96',
            lon: '-85.00',
          },
          {
            lat: '65.71',
            lon: '-84.63',
          },
        ],
        [
          {
            lat: '62.75',
            lon: '-81.84',
          },
          {
            lat: '62.63',
            lon: '-82.01',
          },
        ],
        [
          {
            lat: '62.12',
            lon: '-79.88',
          },
          {
            lat: '62.12',
            lon: '-79.88',
          },
        ],
        [
          {
            lat: '59.89',
            lon: '-43.53',
          },
          {
            lat: '60.67',
            lon: '-45.29',
          },
          {
            lat: '60.83',
            lon: '-47.91',
          },
          {
            lat: '62.41',
            lon: '-49.90',
          },
          {
            lat: '64.42',
            lon: '-50.71',
          },
          {
            lat: '64.94',
            lon: '-51.39',
          },
          {
            lat: '66.09',
            lon: '-52.96',
          },
          {
            lat: '67.19',
            lon: '-53.62',
          },
          {
            lat: '67.51',
            lon: '-53.51',
          },
          {
            lat: '68.65',
            lon: '-51.84',
          },
          {
            lat: '70.00',
            lon: '-52.19',
          },
          {
            lat: '71.03',
            lon: '-51.85',
          },
          {
            lat: '71.41',
            lon: '-55.41',
          },
          {
            lat: '72.97',
            lon: '-54.63',
          },
          {
            lat: '74.70',
            lon: '-56.98',
          },
          {
            lat: '76.09',
            lon: '-61.95',
          },
          {
            lat: '75.83',
            lon: '-66.38',
          },
          {
            lat: '77.00',
            lon: '-71.13',
          },
          {
            lat: '77.60',
            lon: '-66.81',
          },
          {
            lat: '77.78',
            lon: '-70.78',
          },
          {
            lat: '79.70',
            lon: '-64.96',
          },
          {
            lat: '81.16',
            lon: '-63.38',
          },
          {
            lat: '82.17',
            lon: '-56.89',
          },
          {
            lat: '82.15',
            lon: '-48.18',
          },
          {
            lat: '82.74',
            lon: '-42.08',
          },
          {
            lat: '83.54',
            lon: '-38.02',
          },
          {
            lat: '82.94',
            lon: '-23.96',
          },
          {
            lat: '81.97',
            lon: '-25.97',
          },
          {
            lat: '80.64',
            lon: '-25.99',
          },
          {
            lat: '80.97',
            lon: '-13.57',
          },
          {
            lat: '80.16',
            lon: '-16.60',
          },
          {
            lat: '78.82',
            lon: '-19.82',
          },
          {
            lat: '77.54',
            lon: '-18.80',
          },
          {
            lat: '76.46',
            lon: '-21.98',
          },
          {
            lat: '75.12',
            lon: '-20.69',
          },
          {
            lat: '74.40',
            lon: '-21.78',
          },
          {
            lat: '73.69',
            lon: '-24.10',
          },
          {
            lat: '73.08',
            lon: '-26.54',
          },
          {
            lat: '72.69',
            lon: '-24.63',
          },
          {
            lat: '71.69',
            lon: '-21.84',
          },
          {
            lat: '71.24',
            lon: '-24.62',
          },
          {
            lat: '70.89',
            lon: '-27.16',
          },
          {
            lat: '70.00',
            lon: '-27.21',
          },
          {
            lat: '69.35',
            lon: '-24.10',
          },
          {
            lat: '68.43',
            lon: '-28.35',
          },
          {
            lat: '68.56',
            lon: '-32.48',
          },
          {
            lat: '66.26',
            lon: '-35.26',
          },
          {
            lat: '65.90',
            lon: '-37.90',
          },
          {
            lat: '65.00',
            lon: '-40.04',
          },
          {
            lat: '64.04',
            lon: '-40.49',
          },
          {
            lat: '63.14',
            lon: '-42.01',
          },
          {
            lat: '61.15',
            lon: '-42.88',
          },
          {
            lat: '60.07',
            lon: '-43.09',
          },
          {
            lat: '59.90',
            lon: '-43.56',
          },
        ],
        [
          {
            lat: '66.41',
            lon: '-16.26',
          },
          {
            lat: '64.29',
            lon: '-15.32',
          },
          {
            lat: '63.47',
            lon: '-20.14',
          },
          {
            lat: '64.21',
            lon: '-21.76',
          },
          {
            lat: '64.97',
            lon: '-21.33',
          },
          {
            lat: '65.62',
            lon: '-23.04',
          },
          {
            lat: '66.26',
            lon: '-21.76',
          },
          {
            lat: '66.12',
            lon: '-18.77',
          },
          {
            lat: '66.35',
            lon: '-16.23',
          },
        ],
        [
          {
            lat: '51.47',
            lon: '0.56',
          },
          {
            lat: '54.94',
            lon: '-1.71',
          },
          {
            lat: '57.52',
            lon: '-3.41',
          },
          {
            lat: '58.14',
            lon: '-5.42',
          },
          {
            lat: '55.59',
            lon: '-5.77',
          },
          {
            lat: '54.82',
            lon: '-3.48',
          },
          {
            lat: '52.88',
            lon: '-4.68',
          },
          {
            lat: '51.58',
            lon: '-2.68',
          },
          {
            lat: '50.08',
            lon: '-3.80',
          },
          {
            lat: '51.14',
            lon: '1.26',
          },
          {
            lat: '51.41',
            lon: '0.65',
          },
        ],
        [
          {
            lat: '54.91',
            lon: '-7.17',
          },
          {
            lat: '53.47',
            lon: '-9.97',
          },
          {
            lat: '51.76',
            lon: '-8.52',
          },
          {
            lat: '54.79',
            lon: '-5.69',
          },
          {
            lat: '55.25',
            lon: '-7.34',
          },
        ],
        [
          {
            lat: '60.66',
            lon: '-1.33',
          },
          {
            lat: '60.38',
            lon: '-1.17',
          },
        ],
        [
          {
            lat: '58.44',
            lon: '-6.18',
          },
          {
            lat: '58.36',
            lon: '-6.09',
          },
        ],
        [
          {
            lat: '57.58',
            lon: '-6.47',
          },
          {
            lat: '57.54',
            lon: '-6.33',
          },
        ],
        [
          {
            lat: '57.54',
            lon: '-7.30',
          },
        ],
        [
          {
            lat: '57.05',
            lon: '-7.46',
          },
        ],
        [
          {
            lat: '56.94',
            lon: '-6.54',
          },
        ],
        [
          {
            lat: '55.94',
            lon: '-6.00',
          },
        ],
        [
          {
            lat: '55.55',
            lon: '-5.09',
          },
        ],
        [
          {
            lat: '54.38',
            lon: '-4.44',
          },
          {
            lat: '54.19',
            lon: '-4.30',
          },
        ],
        [
          {
            lat: '71.02',
            lon: '-8.08',
          },
          {
            lat: '70.86',
            lon: '-8.21',
          },
        ],
        [
          {
            lat: '79.52',
            lon: '16.92',
          },
          {
            lat: '78.46',
            lon: '22.26',
          },
          {
            lat: '76.41',
            lon: '16.86',
          },
          {
            lat: '77.39',
            lon: '16.00',
          },
          {
            lat: '77.92',
            lon: '16.03',
          },
          {
            lat: '79.50',
            lon: '16.81',
          },
        ],
        [
          {
            lat: '79.40',
            lon: '14.71',
          },
          {
            lat: '79.12',
            lon: '16.05',
          },
          {
            lat: '77.80',
            lon: '14.02',
          },
          {
            lat: '78.46',
            lon: '13.56',
          },
          {
            lat: '79.26',
            lon: '12.63',
          },
          {
            lat: '79.40',
            lon: '14.68',
          },
        ],
        [
          {
            lat: '78.24',
            lon: '22.01',
          },
          {
            lat: '78.23',
            lon: '21.86',
          },
        ],
        [
          {
            lat: '77.75',
            lon: '21.54',
          },
          {
            lat: '77.26',
            lon: '23.88',
          },
          {
            lat: '77.67',
            lon: '21.53',
          },
          {
            lat: '77.79',
            lon: '22.79',
          },
        ],
        [
          {
            lat: '79.97',
            lon: '23.50',
          },
          {
            lat: '79.54',
            lon: '28.24',
          },
          {
            lat: '78.94',
            lon: '20.85',
          },
          {
            lat: '79.34',
            lon: '19.00',
          },
          {
            lat: '79.88',
            lon: '21.05',
          },
          {
            lat: '79.96',
            lon: '23.41',
          },
        ],
        [
          {
            lat: '80.23',
            lon: '46.98',
          },
          {
            lat: '79.97',
            lon: '43.13',
          },
          {
            lat: '80.22',
            lon: '47.18',
          },
        ],
        [
          {
            lat: '80.19',
            lon: '50.43',
          },
          {
            lat: '79.88',
            lon: '50.55',
          },
          {
            lat: '79.86',
            lon: '47.77',
          },
          {
            lat: '80.14',
            lon: '50.45',
          },
        ],
        [
          {
            lat: '80.18',
            lon: '61.79',
          },
          {
            lat: '80.18',
            lon: '61.79',
          },
        ],
        [
          {
            lat: '80.69',
            lon: '65.08',
          },
          {
            lat: '80.59',
            lon: '64.27',
          },
          {
            lat: '80.68',
            lon: '65.13',
          },
        ],
        [
          {
            lat: '35.66',
            lon: '-5.13',
          },
          {
            lat: '36.63',
            lon: '4.06',
          },
          {
            lat: '37.12',
            lon: '10.40',
          },
          {
            lat: '33.61',
            lon: '11.36',
          },
          {
            lat: '30.10',
            lon: '20.10',
          },
          {
            lat: '32.17',
            lon: '23.49',
          },
          {
            lat: '30.80',
            lon: '31.65',
          },
          {
            lat: '23.74',
            lon: '35.76',
          },
          {
            lat: '14.82',
            lon: '39.75',
          },
          {
            lat: '11.34',
            lon: '42.93',
          },
          {
            lat: '11.45',
            lon: '51.52',
          },
          {
            lat: '6.99',
            lon: '49.82',
          },
          {
            lat: '-0.62',
            lon: '43.13',
          },
          {
            lat: '-7.58',
            lon: '39.15',
          },
          {
            lat: '-13.20',
            lon: '40.37',
          },
          {
            lat: '-18.17',
            lon: '37.74',
          },
          {
            lat: '-22.71',
            lon: '35.33',
          },
          {
            lat: '-28.15',
            lon: '32.84',
          },
          {
            lat: '-34.39',
            lon: '26.50',
          },
          {
            lat: '-35.51',
            lon: '19.55',
          },
          {
            lat: '-30.88',
            lon: '17.50',
          },
          {
            lat: '-18.75',
            lon: '12.24',
          },
          {
            lat: '-12.81',
            lon: '13.89',
          },
          {
            lat: '-5.55',
            lon: '12.05',
          },
          {
            lat: '0.14',
            lon: '9.67',
          },
          {
            lat: '3.79',
            lon: '7.19',
          },
          {
            lat: '5.39',
            lon: '1.74',
          },
          {
            lat: '4.59',
            lon: '-4.77',
          },
          {
            lat: '6.75',
            lon: '-12.00',
          },
          {
            lat: '10.98',
            lon: '-15.54',
          },
          {
            lat: '15.50',
            lon: '-16.33',
          },
          {
            lat: '22.29',
            lon: '-16.10',
          },
          {
            lat: '27.12',
            lon: '-12.90',
          },
          {
            lat: '31.09',
            lon: '-9.52',
          },
          {
            lat: '35.58',
            lon: '-5.41',
          },
        ],
        [
          {
            lat: '0.00',
            lon: '33.71',
          },
          {
            lat: '-3.42',
            lon: '33.48',
          },
          {
            lat: '-0.20',
            lon: '33.34',
          },
          {
            lat: '0.00',
            lon: '33.71',
          },
        ],
        [
          {
            lat: '-12.50',
            lon: '49.30',
          },
          {
            lat: '-18.79',
            lon: '49.28',
          },
          {
            lat: '-25.50',
            lon: '43.95',
          },
          {
            lat: '-20.08',
            lon: '44.37',
          },
          {
            lat: '-16.31',
            lon: '46.34',
          },
          {
            lat: '-14.08',
            lon: '47.91',
          },
          {
            lat: '-12.50',
            lon: '49.30',
          },
        ],
        [
          {
            lat: '69.10',
            lon: '178.88',
          },
          {
            lat: '68.42',
            lon: '181.20',
          },
          {
            lat: '67.78',
            lon: '183.52',
          },
          {
            lat: '66.38',
            lon: '188.87',
          },
          {
            lat: '64.74',
            lon: '186.54',
          },
          {
            lat: '65.63',
            lon: '182.87',
          },
          {
            lat: '65.14',
            lon: '180.13',
          },
          {
            lat: '64.88',
            lon: '179.48',
          },
          {
            lat: '64.29',
            lon: '178.20',
          },
          {
            lat: '62.62',
            lon: '177.46',
          },
          {
            lat: '60.17',
            lon: '170.42',
          },
          {
            lat: '59.89',
            lon: '164.48',
          },
          {
            lat: '57.34',
            lon: '162.92',
          },
          {
            lat: '54.88',
            lon: '161.82',
          },
          {
            lat: '51.09',
            lon: '156.42',
          },
          {
            lat: '57.76',
            lon: '156.40',
          },
          {
            lat: '61.73',
            lon: '163.79',
          },
          {
            lat: '60.73',
            lon: '159.90',
          },
          {
            lat: '61.68',
            lon: '156.81',
          },
          {
            lat: '59.10',
            lon: '153.83',
          },
          {
            lat: '59.46',
            lon: '148.57',
          },
          {
            lat: '58.39',
            lon: '140.77',
          },
          {
            lat: '54.07',
            lon: '137.10',
          },
          {
            lat: '52.43',
            lon: '140.72',
          },
          {
            lat: '47.30',
            lon: '138.77',
          },
          {
            lat: '42.04',
            lon: '129.92',
          },
          {
            lat: '38.46',
            lon: '128.33',
          },
          {
            lat: '35.18',
            lon: '126.15',
          },
          {
            lat: '39.08',
            lon: '125.12',
          },
          {
            lat: '40.15',
            lon: '121.62',
          },
          {
            lat: '38.21',
            lon: '117.58',
          },
          {
            lat: '36.90',
            lon: '121.77',
          },
          {
            lat: '32.65',
            lon: '120.73',
          },
          {
            lat: '30.25',
            lon: '121.28',
          },
          {
            lat: '24.93',
            lon: '118.83',
          },
          {
            lat: '21.81',
            lon: '112.69',
          },
          {
            lat: '21.73',
            lon: '108.53',
          },
          {
            lat: '16.34',
            lon: '107.55',
          },
          {
            lat: '10.45',
            lon: '107.32',
          },
          {
            lat: '10.37',
            lon: '104.39',
          },
          {
            lat: '13.52',
            lon: '100.01',
          },
          {
            lat: '8.30',
            lon: '100.26',
          },
          {
            lat: '1.56',
            lon: '103.22',
          },
          {
            lat: '9.17',
            lon: '98.21',
          },
          {
            lat: '15.36',
            lon: '97.66',
          },
          {
            lat: '17.79',
            lon: '94.21',
          },
          {
            lat: '21.74',
            lon: '90.05',
          },
          {
            lat: '21.03',
            lon: '90.06',
          },
          {
            lat: '15.95',
            lon: '82.06',
          },
          {
            lat: '11.72',
            lon: '80.05',
          },
          {
            lat: '8.60',
            lon: '76.41',
          },
          {
            lat: '17.43',
            lon: '72.79',
          },
          {
            lat: '20.00',
            lon: '72.02',
          },
          {
            lat: '21.99',
            lon: '68.98',
          },
          {
            lat: '24.41',
            lon: '64.62',
          },
          {
            lat: '24.77',
            lon: '57.83',
          },
          {
            lat: '26.20',
            lon: '53.11',
          },
          {
            lat: '29.41',
            lon: '49.67',
          },
          {
            lat: '25.15',
            lon: '50.96',
          },
          {
            lat: '23.44',
            lon: '54.33',
          },
          {
            lat: '22.57',
            lon: '59.03',
          },
          {
            lat: '18.86',
            lon: '57.87',
          },
          {
            lat: '15.74',
            lon: '52.95',
          },
          {
            lat: '12.96',
            lon: '47.26',
          },
          {
            lat: '14.68',
            lon: '42.75',
          },
          {
            lat: '19.61',
            lon: '39.93',
          },
          {
            lat: '25.78',
            lon: '36.92',
          },
          {
            lat: '28.46',
            lon: '33.30',
          },
          {
            lat: '30.63',
            lon: '32.60',
          },
          {
            lat: '30.58',
            lon: '32.18',
          },
          {
            lat: '35.03',
            lon: '36.08',
          },
          {
            lat: '36.17',
            lon: '32.53',
          },
          {
            lat: '36.94',
            lon: '27.77',
          },
          {
            lat: '39.18',
            lon: '26.51',
          },
          {
            lat: '40.82',
            lon: '31.54',
          },
          {
            lat: '40.48',
            lon: '38.53',
          },
          {
            lat: '43.17',
            lon: '40.35',
          },
          {
            lat: '46.45',
            lon: '39.88',
          },
          {
            lat: '44.99',
            lon: '35.18',
          },
          {
            lat: '44.96',
            lon: '33.50',
          },
          {
            lat: '45.14',
            lon: '30.24',
          },
          {
            lat: '41.48',
            lon: '28.70',
          },
          {
            lat: '39.84',
            lon: '26.55',
          },
          {
            lat: '39.67',
            lon: '23.62',
          },
          {
            lat: '37.34',
            lon: '23.80',
          },
          {
            lat: '36.92',
            lon: '21.90',
          },
          {
            lat: '42.02',
            lon: '18.79',
          },
          {
            lat: '44.31',
            lon: '14.52',
          },
          {
            lat: '42.25',
            lon: '14.58',
          },
          {
            lat: '39.57',
            lon: '18.32',
          },
          {
            lat: '39.35',
            lon: '16.05',
          },
          {
            lat: '42.36',
            lon: '11.52',
          },
          {
            lat: '43.08',
            lon: '6.87',
          },
          {
            lat: '41.09',
            lon: '2.80',
          },
          {
            lat: '37.14',
            lon: '-1.11',
          },
          {
            lat: '36.70',
            lon: '-6.24',
          },
          {
            lat: '39.57',
            lon: '-8.67',
          },
          {
            lat: '43.13',
            lon: '-6.51',
          },
          {
            lat: '45.55',
            lon: '-0.84',
          },
          {
            lat: '48.40',
            lon: '-3.93',
          },
          {
            lat: '49.09',
            lon: '0.48',
          },
          {
            lat: '51.29',
            lon: '4.20',
          },
          {
            lat: '52.92',
            lon: '6.44',
          },
          {
            lat: '55.94',
            lon: '8.42',
          },
          {
            lat: '55.49',
            lon: '11.72',
          },
          {
            lat: '53.66',
            lon: '11.73',
          },
          {
            lat: '54.14',
            lon: '16.78',
          },
          {
            lat: '56.32',
            lon: '21.40',
          },
          {
            lat: '57.20',
            lon: '24.67',
          },
          {
            lat: '59.18',
            lon: '28.94',
          },
          {
            lat: '59.52',
            lon: '24.16',
          },
          {
            lat: '62.66',
            lon: '22.07',
          },
          {
            lat: '65.35',
            lon: '23.76',
          },
          {
            lat: '62.54',
            lon: '18.70',
          },
          {
            lat: '59.67',
            lon: '19.11',
          },
          {
            lat: '58.54',
            lon: '18.40',
          },
          {
            lat: '55.73',
            lon: '15.34',
          },
          {
            lat: '58.08',
            lon: '11.74',
          },
          {
            lat: '57.68',
            lon: '8.37',
          },
          {
            lat: '59.20',
            lon: '5.80',
          },
          {
            lat: '60.86',
            lon: '7.38',
          },
          {
            lat: '61.86',
            lon: '7.51',
          },
          {
            lat: '62.99',
            lon: '9.62',
          },
          {
            lat: '65.46',
            lon: '13.37',
          },
          {
            lat: '67.12',
            lon: '15.46',
          },
          {
            lat: '68.62',
            lon: '18.54',
          },
          {
            lat: '69.64',
            lon: '22.32',
          },
          {
            lat: '70.17',
            lon: '24.77',
          },
          {
            lat: '69.79',
            lon: '25.93',
          },
          {
            lat: '70.46',
            lon: '28.56',
          },
          {
            lat: '69.76',
            lon: '29.75',
          },
          {
            lat: '69.11',
            lon: '33.83',
          },
          {
            lat: '66.85',
            lon: '41.90',
          },
          {
            lat: '66.25',
            lon: '35.14',
          },
          {
            lat: '66.07',
            lon: '33.30',
          },
          {
            lat: '64.15',
            lon: '35.46',
          },
          {
            lat: '64.03',
            lon: '37.68',
          },
          {
            lat: '64.09',
            lon: '41.71',
          },
          {
            lat: '65.58',
            lon: '44.80',
          },
          {
            lat: '68.16',
            lon: '44.87',
          },
          {
            lat: '66.83',
            lon: '45.92',
          },
          {
            lat: '67.85',
            lon: '51.79',
          },
          {
            lat: '67.89',
            lon: '53.70',
          },
          {
            lat: '68.09',
            lon: '59.68',
          },
          {
            lat: '69.08',
            lon: '65.07',
          },
          {
            lat: '69.19',
            lon: '68.56',
          },
          {
            lat: '70.97',
            lon: '68.38',
          },
          {
            lat: '71.62',
            lon: '73.03',
          },
          {
            lat: '68.29',
            lon: '73.80',
          },
          {
            lat: '66.45',
            lon: '69.42',
          },
          {
            lat: '66.36',
            lon: '73.43',
          },
          {
            lat: '68.36',
            lon: '77.51',
          },
          {
            lat: '66.74',
            lon: '80.74',
          },
          {
            lat: '68.67',
            lon: '75.27',
          },
          {
            lat: '71.80',
            lon: '75.11',
          },
          {
            lat: '70.56',
            lon: '78.62',
          },
          {
            lat: '71.90',
            lon: '78.43',
          },
          {
            lat: '71.23',
            lon: '82.72',
          },
          {
            lat: '70.03',
            lon: '84.25',
          },
          {
            lat: '72.76',
            lon: '81.40',
          },
          {
            lat: '74.01',
            lon: '86.50',
          },
          {
            lat: '74.78',
            lon: '87.68',
          },
          {
            lat: '75.23',
            lon: '90.25',
          },
          {
            lat: '75.57',
            lon: '89.68',
          },
          {
            lat: '75.95',
            lon: '95.12',
          },
          {
            lat: '76.09',
            lon: '99.69',
          },
          {
            lat: '77.52',
            lon: '104.10',
          },
          {
            lat: '76.40',
            lon: '106.34',
          },
          {
            lat: '75.60',
            lon: '112.99',
          },
          {
            lat: '73.72',
            lon: '107.88',
          },
          {
            lat: '73.71',
            lon: '110.43',
          },
          {
            lat: '73.37',
            lon: '113.34',
          },
          {
            lat: '73.28',
            lon: '123.10',
          },
          {
            lat: '73.02',
            lon: '128.94',
          },
          {
            lat: '72.24',
            lon: '126.10',
          },
          {
            lat: '70.86',
            lon: '130.53',
          },
          {
            lat: '71.51',
            lon: '135.49',
          },
          {
            lat: '72.23',
            lon: '139.60',
          },
          {
            lat: '72.39',
            lon: '146.04',
          },
          {
            lat: '72.21',
            lon: '146.92',
          },
          {
            lat: '71.28',
            lon: '150.77',
          },
          {
            lat: '70.14',
            lon: '159.92',
          },
          {
            lat: '69.63',
            lon: '167.68',
          },
          {
            lat: '69.99',
            lon: '170.20',
          },
          {
            lat: '69.10',
            lon: '178.88',
          },
        ],
        [
          {
            lat: '76.71',
            lon: '68.33',
          },
          {
            lat: '75.62',
            lon: '66.03',
          },
          {
            lat: '74.11',
            lon: '59.10',
          },
          {
            lat: '73.03',
            lon: '54.92',
          },
          {
            lat: '74.10',
            lon: '56.67',
          },
          {
            lat: '75.09',
            lon: '58.56',
          },
          {
            lat: '75.87',
            lon: '63.86',
          },
          {
            lat: '76.70',
            lon: '68.19',
          },
        ],
        [
          {
            lat: '72.57',
            lon: '53.04',
          },
          {
            lat: '70.39',
            lon: '58.29',
          },
          {
            lat: '70.78',
            lon: '55.03',
          },
          {
            lat: '72.26',
            lon: '53.44',
          },
          {
            lat: '72.61',
            lon: '53.63',
          },
        ],
        [
          {
            lat: '46.50',
            lon: '52.22',
          },
          {
            lat: '44.73',
            lon: '51.73',
          },
          {
            lat: '41.80',
            lon: '52.56',
          },
          {
            lat: '40.40',
            lon: '53.43',
          },
          {
            lat: '37.86',
            lon: '54.22',
          },
          {
            lat: '38.45',
            lon: '49.04',
          },
          {
            lat: '42.76',
            lon: '48.17',
          },
          {
            lat: '45.64',
            lon: '49.33',
          },
          {
            lat: '46.50',
            lon: '52.22',
          },
        ],
        [
          {
            lat: '46.32',
            lon: '62.32',
          },
          {
            lat: '43.06',
            lon: '60.32',
          },
          {
            lat: '45.58',
            lon: '59.57',
          },
          {
            lat: '46.33',
            lon: '61.94',
          },
        ],
        [
          {
            lat: '46.12',
            lon: '79.55',
          },
          {
            lat: '44.44',
            lon: '74.30',
          },
          {
            lat: '45.79',
            lon: '78.62',
          },
          {
            lat: '46.07',
            lon: '79.66',
          },
        ],
        [
          {
            lat: '41.96',
            lon: '76.81',
          },
          {
            lat: '41.86',
            lon: '76.73',
          },
        ],
        [
          {
            lat: '35.15',
            lon: '35.15',
          },
          {
            lat: '34.84',
            lon: '34.61',
          },
          {
            lat: '35.17',
            lon: '35.18',
          },
        ],
        [
          {
            lat: '35.33',
            lon: '23.84',
          },
          {
            lat: '34.91',
            lon: '24.30',
          },
          {
            lat: '35.39',
            lon: '24.09',
          },
        ],
        [
          {
            lat: '37.89',
            lon: '15.54',
          },
          {
            lat: '37.89',
            lon: '13.47',
          },
          {
            lat: '37.89',
            lon: '15.54',
          },
        ],
        [
          {
            lat: '40.95',
            lon: '9.56',
          },
          {
            lat: '39.99',
            lon: '8.46',
          },
          {
            lat: '40.69',
            lon: '9.12',
          },
        ],
        [
          {
            lat: '42.60',
            lon: '9.72',
          },
          {
            lat: '42.35',
            lon: '9.54',
          },
        ],
        [
          {
            lat: '8.95',
            lon: '80.60',
          },
          {
            lat: '5.96',
            lon: '79.73',
          },
          {
            lat: '8.30',
            lon: '80.10',
          },
        ],
        [
          {
            lat: '57.44',
            lon: '11.04',
          },
          {
            lat: '57.25',
            lon: '10.67',
          },
        ],
        [
          {
            lat: '24.67',
            lon: '-77.92',
          },
          {
            lat: '24.22',
            lon: '-77.98',
          },
        ],
        [
          {
            lat: '23.62',
            lon: '-77.61',
          },
          {
            lat: '23.64',
            lon: '-77.18',
          },
        ],
        [
          {
            lat: '24.13',
            lon: '-75.55',
          },
          {
            lat: '24.31',
            lon: '-75.41',
          },
        ],
        [
          {
            lat: '-0.17',
            lon: '-91.40',
          },
          {
            lat: '-0.26',
            lon: '-91.52',
          },
        ],
        [
          {
            lat: '46.68',
            lon: '-60.25',
          },
          {
            lat: '46.33',
            lon: '-60.71',
          },
        ],
        [
          {
            lat: '49.47',
            lon: '-63.89',
          },
          {
            lat: '49.43',
            lon: '-63.45',
          },
        ],
        [
          {
            lat: '-10.60',
            lon: '142.53',
          },
          {
            lat: '-16.34',
            lon: '145.62',
          },
          {
            lat: '-22.09',
            lon: '149.79',
          },
          {
            lat: '-26.82',
            lon: '153.21',
          },
          {
            lat: '-35.19',
            lon: '150.52',
          },
          {
            lat: '-38.53',
            lon: '145.60',
          },
          {
            lat: '-37.69',
            lon: '140.13',
          },
          {
            lat: '-34.77',
            lon: '137.34',
          },
          {
            lat: '-34.56',
            lon: '135.76',
          },
          {
            lat: '-31.34',
            lon: '131.50',
          },
          {
            lat: '-33.65',
            lon: '121.72',
          },
          {
            lat: '-33.25',
            lon: '115.62',
          },
          {
            lat: '-26.01',
            lon: '114.09',
          },
          {
            lat: '-21.27',
            lon: '114.88',
          },
          {
            lat: '-18.13',
            lon: '122.34',
          },
          {
            lat: '-14.53',
            lon: '125.32',
          },
          {
            lat: '-14.90',
            lon: '128.39',
          },
          {
            lat: '-11.42',
            lon: '132.35',
          },
          {
            lat: '-12.43',
            lon: '136.16',
          },
          {
            lat: '-16.45',
            lon: '138.07',
          },
          {
            lat: '-10.78',
            lon: '142.25',
          },
        ],
        [
          {
            lat: '-40.68',
            lon: '144.72',
          },
          {
            lat: '-42.14',
            lon: '148.32',
          },
          {
            lat: '-42.77',
            lon: '145.57',
          },
          {
            lat: '-41.19',
            lon: '146.47',
          },
        ],
        [
          {
            lat: '-34.23',
            lon: '172.86',
          },
          {
            lat: '-37.52',
            lon: '176.10',
          },
          {
            lat: '-39.49',
            lon: '177.06',
          },
          {
            lat: '-38.03',
            lon: '174.77',
          },
          {
            lat: '-34.27',
            lon: '172.83',
          },
        ],
        [
          {
            lat: '-40.53',
            lon: '172.36',
          },
          {
            lat: '-43.81',
            lon: '172.92',
          },
          {
            lat: '-46.13',
            lon: '168.41',
          },
          {
            lat: '-43.21',
            lon: '170.26',
          },
          {
            lat: '-40.94',
            lon: '173.69',
          },
        ],
        [
          {
            lat: '-10.18',
            lon: '150.74',
          },
          {
            lat: '-8.26',
            lon: '143.04',
          },
          {
            lat: '-6.97',
            lon: '138.48',
          },
          {
            lat: '-2.94',
            lon: '131.95',
          },
          {
            lat: '-1.35',
            lon: '130.91',
          },
          {
            lat: '-2.64',
            lon: '134.38',
          },
          {
            lat: '-2.62',
            lon: '141.24',
          },
          {
            lat: '-8.15',
            lon: '148.19',
          },
          {
            lat: '-10.27',
            lon: '150.75',
          },
        ],
        [
          {
            lat: '7.01',
            lon: '117.24',
          },
          {
            lat: '0.76',
            lon: '117.90',
          },
          {
            lat: '-3.50',
            lon: '113.89',
          },
          {
            lat: '-0.82',
            lon: '109.44',
          },
          {
            lat: '3.38',
            lon: '113.13',
          },
          {
            lat: '7.01',
            lon: '117.24',
          },
        ],
        [
          {
            lat: '5.75',
            lon: '95.31',
          },
          {
            lat: '1.40',
            lon: '102.32',
          },
          {
            lat: '-2.98',
            lon: '106.03',
          },
          {
            lat: '-2.81',
            lon: '101.46',
          },
          {
            lat: '5.73',
            lon: '95.20',
          },
        ],
        [
          {
            lat: '41.53',
            lon: '140.91',
          },
          {
            lat: '35.75',
            lon: '140.79',
          },
          {
            lat: '34.56',
            lon: '136.82',
          },
          {
            lat: '34.72',
            lon: '133.56',
          },
          {
            lat: '35.41',
            lon: '132.49',
          },
          {
            lat: '37.20',
            lon: '136.73',
          },
          {
            lat: '40.00',
            lon: '139.82',
          },
          {
            lat: '41.43',
            lon: '140.68',
          },
        ],
        [
          {
            lat: '34.30',
            lon: '133.71',
          },
          {
            lat: '31.58',
            lon: '131.41',
          },
          {
            lat: '33.10',
            lon: '129.38',
          },
          {
            lat: '34.37',
            lon: '133.90',
          },
        ],
        [
          {
            lat: '45.50',
            lon: '141.89',
          },
          {
            lat: '42.92',
            lon: '144.12',
          },
          {
            lat: '41.64',
            lon: '140.30',
          },
          {
            lat: '45.30',
            lon: '141.53',
          },
          {
            lat: '45.53',
            lon: '141.89',
          },
        ],
        [
          {
            lat: '54.36',
            lon: '142.57',
          },
          {
            lat: '49.19',
            lon: '143.64',
          },
          {
            lat: '45.88',
            lon: '141.99',
          },
          {
            lat: '50.85',
            lon: '141.92',
          },
          {
            lat: '54.34',
            lon: '142.60',
          },
        ],
        [
          {
            lat: '25.48',
            lon: '121.92',
          },
          {
            lat: '24.70',
            lon: '120.53',
          },
          {
            lat: '25.51',
            lon: '121.70',
          },
        ],
        [
          {
            lat: '20.07',
            lon: '110.81',
          },
          {
            lat: '19.66',
            lon: '109.20',
          },
          {
            lat: '20.07',
            lon: '110.81',
          },
        ],
        [
          {
            lat: '-6.16',
            lon: '106.51',
          },
          {
            lat: '-7.72',
            lon: '114.15',
          },
          {
            lat: '-7.89',
            lon: '108.71',
          },
          {
            lat: '-6.16',
            lon: '106.51',
          },
        ],
        [
          {
            lat: '-20.01',
            lon: '164.27',
          },
          {
            lat: '-20.27',
            lon: '164.16',
          },
        ],
        [
          {
            lat: '-17.04',
            lon: '178.61',
          },
          {
            lat: '-17.04',
            lon: '178.61',
          },
        ],
        [
          {
            lat: '-16.43',
            lon: '179.45',
          },
          {
            lat: '-16.43',
            lon: '179.35',
          },
        ],
        [
          {
            lat: '-13.39',
            lon: '-172.55',
          },
          {
            lat: '-13.78',
            lon: '-172.61',
          },
        ],
        [
          {
            lat: '18.67',
            lon: '122.26',
          },
          {
            lat: '13.86',
            lon: '123.05',
          },
          {
            lat: '13.80',
            lon: '120.73',
          },
          {
            lat: '16.43',
            lon: '120.43',
          },
          {
            lat: '18.40',
            lon: '121.72',
          },
        ],
        [
          {
            lat: '9.79',
            lon: '125.34',
          },
          {
            lat: '6.28',
            lon: '125.56',
          },
          {
            lat: '7.00',
            lon: '122.38',
          },
          {
            lat: '9.38',
            lon: '125.10',
          },
        ],
        [
          {
            lat: '11.35',
            lon: '119.64',
          },
          {
            lat: '10.16',
            lon: '118.81',
          },
          {
            lat: '10.86',
            lon: '119.59',
          },
          {
            lat: '11.35',
            lon: '119.64',
          },
        ],
        [
          {
            lat: '65.14',
            lon: '-179.87',
          },
          {
            lat: '65.63',
            lon: '-177.13',
          },
          {
            lat: '64.74',
            lon: '-173.46',
          },
          {
            lat: '66.38',
            lon: '-171.13',
          },
          {
            lat: '67.78',
            lon: '-176.48',
          },
          {
            lat: '68.42',
            lon: '-178.80',
          },
        ],
        [
          {
            lat: '79.08',
            lon: '101.96',
          },
          {
            lat: '77.86',
            lon: '101.31',
          },
          {
            lat: '79.04',
            lon: '101.22',
          },
        ],
        [
          {
            lat: '79.29',
            lon: '94.29',
          },
          {
            lat: '78.68',
            lon: '95.31',
          },
          {
            lat: '79.43',
            lon: '100.02',
          },
          {
            lat: '79.62',
            lon: '97.26',
          },
          {
            lat: '79.65',
            lon: '95.44',
          },
        ],
        [
          {
            lat: '80.62',
            lon: '95.46',
          },
          {
            lat: '79.66',
            lon: '92.39',
          },
          {
            lat: '80.54',
            lon: '95.07',
          },
        ],
        [
          {
            lat: '76.05',
            lon: '138.54',
          },
          {
            lat: '75.45',
            lon: '144.93',
          },
          {
            lat: '74.99',
            lon: '140.30',
          },
          {
            lat: '75.44',
            lon: '137.27',
          },
          {
            lat: '75.98',
            lon: '138.29',
          },
        ],
        [
          {
            lat: '75.29',
            lon: '146.08',
          },
          {
            lat: '74.73',
            lon: '147.75',
          },
          {
            lat: '75.06',
            lon: '145.85',
          },
        ],
        [
          {
            lat: '73.88',
            lon: '141.44',
          },
          {
            lat: '73.84',
            lon: '141.48',
          },
        ],
        [
          {
            lat: '-71.68',
            lon: '0.01',
          },
          {
            lat: '-70.57',
            lon: '6.57',
          },
          {
            lat: '-70.44',
            lon: '15.04',
          },
          {
            lat: '-70.75',
            lon: '25.10',
          },
          {
            lat: '-69.10',
            lon: '33.37',
          },
          {
            lat: '-69.77',
            lon: '38.46',
          },
          {
            lat: '-68.16',
            lon: '42.85',
          },
          {
            lat: '-67.23',
            lon: '46.59',
          },
          {
            lat: '-66.96',
            lon: '49.35',
          },
          {
            lat: '-65.97',
            lon: '52.90',
          },
          {
            lat: '-67.20',
            lon: '58.46',
          },
          {
            lat: '-67.58',
            lon: '63.60',
          },
          {
            lat: '-68.41',
            lon: '70.63',
          },
          {
            lat: '-70.36',
            lon: '69.24',
          },
          {
            lat: '-69.44',
            lon: '76.20',
          },
          {
            lat: '-66.64',
            lon: '88.08',
          },
          {
            lat: '-66.52',
            lon: '94.98',
          },
          {
            lat: '-66.09',
            lon: '101.53',
          },
          {
            lat: '-65.91',
            lon: '111.31',
          },
          {
            lat: '-66.87',
            lon: '118.64',
          },
          {
            lat: '-66.24',
            lon: '126.24',
          },
          {
            lat: '-66.18',
            lon: '133.09',
          },
          {
            lat: '-66.72',
            lon: '139.85',
          },
          {
            lat: '-67.96',
            lon: '146.86',
          },
          {
            lat: '-68.82',
            lon: '153.65',
          },
          {
            lat: '-69.57',
            lon: '159.94',
          },
          {
            lat: '-70.67',
            lon: '164.10',
          },
          {
            lat: '-71.94',
            lon: '170.19',
          },
          {
            lat: '-74.64',
            lon: '165.68',
          },
          {
            lat: '-77.60',
            lon: '163.82',
          },
          {
            lat: '-78.95',
            lon: '162.10',
          },
          {
            lat: '-82.84',
            lon: '166.72',
          },
          {
            lat: '-83.86',
            lon: '175.58',
          },
        ],
        [
          {
            lat: '-84.37',
            lon: '-178.56',
          },
          {
            lat: '-85.40',
            lon: '-147.96',
          },
          {
            lat: '-81.12',
            lon: '-152.96',
          },
          {
            lat: '-79.50',
            lon: '-153.95',
          },
          {
            lat: '-77.48',
            lon: '-151.24',
          },
          {
            lat: '-76.44',
            lon: '-146.74',
          },
          {
            lat: '-75.16',
            lon: '-137.68',
          },
          {
            lat: '-74.63',
            lon: '-131.63',
          },
          {
            lat: '-74.41',
            lon: '-123.05',
          },
          {
            lat: '-73.97',
            lon: '-114.76',
          },
          {
            lat: '-75.41',
            lon: '-111.91',
          },
          {
            lat: '-74.77',
            lon: '-105.05',
          },
          {
            lat: '-74.21',
            lon: '-100.90',
          },
          {
            lat: '-73.18',
            lon: '-101.04',
          },
          {
            lat: '-73.06',
            lon: '-100.28',
          },
          {
            lat: '-73.33',
            lon: '-93.06',
          },
          {
            lat: '-73.18',
            lon: '-85.40',
          },
          {
            lat: '-73.04',
            lon: '-79.82',
          },
          {
            lat: '-72.52',
            lon: '-78.21',
          },
          {
            lat: '-73.41',
            lon: '-71.90',
          },
          {
            lat: '-71.10',
            lon: '-67.51',
          },
          {
            lat: '-68.92',
            lon: '-67.57',
          },
          {
            lat: '-66.83',
            lon: '-66.65',
          },
          {
            lat: '-65.28',
            lon: '-64.30',
          },
          {
            lat: '-63.74',
            lon: '-59.14',
          },
          {
            lat: '-64.37',
            lon: '-59.58',
          },
          {
            lat: '-65.94',
            lon: '-62.50',
          },
          {
            lat: '-66.66',
            lon: '-62.48',
          },
          {
            lat: '-68.02',
            lon: '-65.64',
          },
          {
            lat: '-69.07',
            lon: '-63.85',
          },
          {
            lat: '-70.87',
            lon: '-61.69',
          },
          {
            lat: '-72.71',
            lon: '-60.89',
          },
          {
            lat: '-74.30',
            lon: '-61.07',
          },
          {
            lat: '-75.88',
            lon: '-63.33',
          },
          {
            lat: '-77.06',
            lon: '-76.05',
          },
          {
            lat: '-77.12',
            lon: '-83.04',
          },
          {
            lat: '-80.83',
            lon: '-74.30',
          },
          {
            lat: '-82.14',
            lon: '-56.40',
          },
          {
            lat: '-81.65',
            lon: '-42.46',
          },
          {
            lat: '-80.17',
            lon: '-31.60',
          },
          {
            lat: '-79.20',
            lon: '-34.01',
          },
          {
            lat: '-77.28',
            lon: '-32.48',
          },
          {
            lat: '-76.18',
            lon: '-26.28',
          },
          {
            lat: '-73.45',
            lon: '-17.18',
          },
          {
            lat: '-72.01',
            lon: '-11.20',
          },
          {
            lat: '-71.98',
            lon: '-8.67',
          },
          {
            lat: '-71.45',
            lon: '-5.45',
          },
          {
            lat: '-71.74',
            lon: '-0.82',
          },
          {
            lat: '-71.68',
            lon: '0.07',
          },
        ],
        [
          {
            lat: '-77.89',
            lon: '164.65',
          },
          {
            lat: '-77.37',
            lon: '170.95',
          },
          {
            lat: '-78.25',
            lon: '179.67',
          },
        ],
        [
          {
            lat: '-78.24',
            lon: '-178.74',
          },
          {
            lat: '-78.47',
            lon: '-165.76',
          },
          {
            lat: '-77.73',
            lon: '-158.42',
          },
        ],
        [
          {
            lat: '-64.63',
            lon: '-58.98',
          },
          {
            lat: '-68.62',
            lon: '-60.99',
          },
          {
            lat: '-71.70',
            lon: '-61.02',
          },
        ],
        [
          {
            lat: '-74.94',
            lon: '-62.01',
          },
          {
            lat: '-77.07',
            lon: '-52.00',
          },
          {
            lat: '-77.80',
            lon: '-42.23',
          },
          {
            lat: '-78.03',
            lon: '-36.22',
          },
        ],
        [
          {
            lat: '-77.81',
            lon: '-35.03',
          },
          {
            lat: '-75.54',
            lon: '-26.13',
          },
          {
            lat: '-73.04',
            lon: '-19.35',
          },
          {
            lat: '-71.86',
            lon: '-12.16',
          },
          {
            lat: '-70.65',
            lon: '-6.15',
          },
          {
            lat: '-69.14',
            lon: '-0.57',
          },
          {
            lat: '-70.25',
            lon: '4.93',
          },
          {
            lat: '-69.99',
            lon: '10.91',
          },
          {
            lat: '-69.87',
            lon: '16.52',
          },
          {
            lat: '-70.22',
            lon: '25.41',
          },
          {
            lat: '-69.29',
            lon: '32.13',
          },
          {
            lat: '-69.58',
            lon: '33.62',
          },
        ],
        [
          {
            lat: '-68.53',
            lon: '70.56',
          },
          {
            lat: '-69.51',
            lon: '73.91',
          },
        ],
        [
          {
            lat: '-67.87',
            lon: '81.42',
          },
          {
            lat: '-66.41',
            lon: '84.67',
          },
          {
            lat: '-66.73',
            lon: '89.07',
          },
        ],
        [
          {
            lat: '-74.67',
            lon: '-135.79',
          },
          {
            lat: '-73.22',
            lon: '-124.34',
          },
          {
            lat: '-74.08',
            lon: '-116.65',
          },
          {
            lat: '-74.64',
            lon: '-109.93',
          },
          {
            lat: '-74.56',
            lon: '-105.36',
          },
          {
            lat: '-74.77',
            lon: '-105.83',
          },
        ],
        [
          {
            lat: '-70.06',
            lon: '-69.30',
          },
          {
            lat: '-72.68',
            lon: '-71.33',
          },
          {
            lat: '-71.85',
            lon: '-71.42',
          },
          {
            lat: '-71.46',
            lon: '-75.10',
          },
          {
            lat: '-70.55',
            lon: '-71.79',
          },
          {
            lat: '-69.26',
            lon: '-70.34',
          },
          {
            lat: '-70.13',
            lon: '-69.34',
          },
        ],
        [
          {
            lat: '-77.83',
            lon: '-49.20',
          },
          {
            lat: '-78.79',
            lon: '-44.59',
          },
          {
            lat: '-80.13',
            lon: '-44.14',
          },
          {
            lat: '-79.95',
            lon: '-59.04',
          },
          {
            lat: '-77.84',
            lon: '-49.28',
          },
          {
            lat: '-77.81',
            lon: '-48.24',
          },
        ],
        [
          {
            lat: '-80.12',
            lon: '-58.13',
          },
          {
            lat: '-80.20',
            lon: '-63.25',
          },
          {
            lat: '-80.12',
            lon: '-58.32',
          },
        ],
        [
          {
            lat: '-78.74',
            lon: '-163.64',
          },
          {
            lat: '-79.93',
            lon: '-161.20',
          },
          {
            lat: '-78.74',
            lon: '-163.62',
          },
        ],
      ],
    };

    return json;
  }
}
