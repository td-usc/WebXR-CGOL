import * as THREE from 'three'
import Experience from '../Experience.js'


export default class Sim {
    constructor(rows, columns){

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.cellSize = 0.1
        this.cellMarginScalar = 0.90
        this.cellSubdivision = 1
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('sim')
            const debugObject = {
                randomize: () => { 
                    this.randomize()
                    this.updateMeshes()
                },
                step: () => {
                    this.step()
                    this.updateMeshes()
                },
                clear: () =>{
                    this.clear()
                    this.updateMeshes()
                }
                // removed for demo
                // back: () => {
                //     this.back()
                //     this.updateMeshes()
                // }
            }
            this.debugFolder.add(debugObject, 'randomize')
            this.debugFolder.add(debugObject, 'step')
            this.debugFolder.add(debugObject, 'clear')
            // removed for demo
            // this.debugFolder.add(debugObject, 'back')
        }
        this.rows = rows
        this.columns = columns

        //https://stackoverflow.com/questions/18163234/declare-an-empty-two-dimensional-array-in-javascript
        // I fell into a trap here trying to use this
        // this.grid = new Array(rows).fill(new Array(columns).fill(false))
        this.grid = new Array(rows).fill(0).map(() => new Array(columns).fill(0))
        this.past = JSON.parse(JSON.stringify(this.grid))

        this.cellGeometry = new THREE.BoxGeometry(this.cellSize,this.cellSize,this.cellSize,this.cellSubdivision,this.cellSubdivision,this.cellSubdivision)
        this.cellMaterial = new THREE.MeshStandardMaterial()
        this.meshes = new THREE.Group()
        this.grid.forEach((row,r) => {
            row.forEach((col,c) =>{
                const cell = new THREE.Mesh(this.cellGeometry,this.cellMaterial.clone())
                cell.r = r
                cell.c = c
                cell.position.x = cell.c * this.cellSize
                cell.position.y = cell.r * this.cellSize
                cell.scale.x *= this.cellMarginScalar
                cell.scale.y *= this.cellMarginScalar
                this.meshes.add(cell)
            })
        })
        this.scene.add(this.meshes)
        this.centerMeshes()
    }
    randomize(){
        this.grid.forEach((row,r) => {
            row.forEach((col,c) =>{
                this.grid[r][c] = Math.random() < 0.5
            })
        })
    }
    updateMeshes(){
        this.meshes.traverse((child)=>{
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.wireframe = ! this.grid[child.r][child.c]
                }
        })
    }
    centerMeshes(){
        this.meshes.position.x -= this.columns * this.cellSize / 2
        this.meshes.position.y += this.cellSize
        this.meshes.position.z -= 0
    }
    step(){
        // https://www.tkglaser.net/conways-game-of-life-in-3d-using-html-5/
        this.past = JSON.parse(JSON.stringify(this.grid))
        this.grid.forEach((row,r) => {
            row.forEach((cell,c) =>{
                // javascript way of handling index out of bounds
                // undefined is falsy, unary operator converts to integer
                let neighbors =
                (+ Boolean(this.past[r][c+1])) + 
                (+ Boolean(this.past[r][c-1])) + 
                //right
                (this.past[r+1]?
                    (+ Boolean(this.past[r+1][c+1])) + 
                    (+ Boolean(this.past[r+1][c])) +
                    (+ Boolean(this.past[r+1][c-1])) : 0) +
                // left
                (this.past[r-1]?
                    (+ Boolean(this.past[r-1][c+1])) + 
                    (+ Boolean(this.past[r-1][c])) +
                    (+ Boolean(this.past[r-1][c-1])) : 0) 

                this.grid[r][c] = neighbors == 2 && this.grid[r][c] || neighbors == 3
            })
        })
    }
    back() {
        // this only works once, not using in demo
        this.grid = this.past
    }
    clear() {
        this.grid = new Array(this.rows).fill(0).map(() => new Array(this.columns).fill(0))
    }
    toggleCell(r,c){
        this.grid[r][c] = ! this.grid[r][c]
    }
    
}