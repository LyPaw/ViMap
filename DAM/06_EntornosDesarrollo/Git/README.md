## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: Git (PDF)](../temario_git.pdf)

# Entornos de Desarrollo - Git

## Conceptos fundamentales

Git es un sistema de control de versiones distribuido, utilizado para gestionar el codigo fuente de proyectos de software.

### Arquitectura de Git

-   **Working Directory**: directorio de trabajo con los archivos actuales.
-   **Staging Area (Index)**: area intermedia donde se preparan los cambios antes del commit.
-   **Local Repository**: repositorio local en tu maquina con el historial de commits.
-   **Remote Repository**: repositorio remoto en un servidor (GitHub, GitLab, etc.).

### Flujo de trabajo basico

```
Working Directory  -->  Staging Area  -->  Local Repo  -->  Remote Repo
    git add              git commit          git push
```

### Ramas (Branches)

-   **main/master**: rama principal del proyecto.
-   **feature/***: ramas para desarrollar nuevas funcionalidades.
-   **develop**: rama de integracion para desarrollo.
-   **release/***: ramas para preparar una version.
-   **hotfix/***: ramas para correcciones urgentes en produccion.

### GitFlow

Flujo de trabajo estandar con ramas:
1.  Se crea `feature/x` desde `develop`
2.  Se trabaja en la rama feature
3.  Se fusiona de vuelta a `develop`
4.  Se crea `release/x` desde `develop`
5.  Se fusiona a `main` y se etiqueta con version
6.  Se fusiona de vuelta a `develop`

### Comandos esenciales

| Comando | Descripcion |
|---------|-------------|
| `git init` | Inicializa un repositorio Git |
| `git clone <url>` | Clona un repositorio remoto |
| `git add <archivo>` | Anade cambios al staging |
| `git commit -m "msg"` | Confirma los cambios en staging |
| `git push` | Sube commits al repositorio remoto |
| `git pull` | Descarga cambios del remoto |
| `git branch` | Lista/crea ramas |
| `git checkout -b <rama>` | Crea y cambia a nueva rama |
| `git merge <rama>` | Fusiona una rama en la actual |
| `git log --oneline` | Muestra historial de commits |
| `git status` | Muestra el estado del working directory |
| `git diff` | Muestra cambios sin staging |
| `git stash` | Guarda cambios temporalmente |

## Ejercicios propuestos

1.  Crea un repositorio local, anade varios archivos, haz commits y visualiza el historial con `git log --oneline --graph`.
2.  Crea una rama feature, haz commits, fusionala con main usando --no-ff y observa el grafo.
3.  Simula un conflicto de merge: dos ramas modifican la misma linea de un archivo. Resuelve el conflicto manualmente.
4.  Usa `git rebase -i HEAD~3` para combinar los ultimos 3 commits en uno solo (squash).
5.  Crea un tag semantico (v1.0.0) y subelo al repositorio remoto. Comprueba que puedes checkout a ese tag.

