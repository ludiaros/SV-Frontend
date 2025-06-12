<!-- filepath: d:\Programacion\Projects\Rosal\sg-rosal\README.md -->
# sg-rosal

Esta es una aplicación móvil construida con el framework Capacitor.

## Tecnologías Utilizadas

*   Capacitor
*   Android (Gradle para la configuración de la compilación)

## Plugins de Capacitor

Este proyecto utiliza los siguientes plugins de Capacitor:

*   `@capacitor/app`: Funcionalidad general de la aplicación.
*   `@capacitor/camera`: Acceso a la cámara del dispositivo.
*   `@capacitor/haptics`: Control de retroalimentación háptica.
*   `@capacitor/keyboard`: Gestión del teclado.
*   `@capacitor/status-bar`: Control de la barra de estado.

## Empezando

Para obtener una copia local y ponerla en funcionamiento, sigue estos sencillos pasos de ejemplo.

### Prerrequisitos

*   Node.js y npm
*   Android Studio (para desarrollo en Android)

### Instalación

1.  Clona el repositorio
    ```sh
    git clone <url-de-tu-repositorio>
    ```
2.  Instala los paquetes NPM
    ```sh
    npm install
    ```
3.  Sincroniza el proyecto Capacitor
    ```sh
    npx capacitor sync
    ```

## Compilando la Aplicación

### Android

1.  Abre la carpeta `android` en Android Studio.
    ```sh
    npx capacitor open android
    ```
2.  Compila el proyecto usando las herramientas de compilación de Android Studio.

## Estructura de Carpetas

Un breve resumen de los directorios clave:

*   `android/`: Contiene el proyecto nativo de Android.
    *   `android/app/capacitor.build.gradle`: Configuración de compilación de Gradle para el módulo de la aplicación Capacitor.
    *   `android/capacitor.settings.gradle`: Configuración de Gradle para los plugins de Capacitor.
*   `node_modules/`: Contiene todos los paquetes npm.
*   `www/` (o `public/` o `dist/` dependiendo de tu framework web): Contiene los activos web para tu aplicación.